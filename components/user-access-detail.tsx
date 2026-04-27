"use client"

import { useState, useCallback, useMemo } from "react"
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Lock,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react"
import {
  availablePages,
  systemUsers,
  accessRequests as initialRequests,
  type AccessRequest,
  type PageAccess,
  type SystemUser,
} from "@/lib/data"

type ViewRole = "user" | "approver" | "admin"

export function UserAccessDetail() {
  const [viewRole, setViewRole] = useState<ViewRole>("user")
  const [requests, setRequests] = useState<AccessRequest[]>(initialRequests)
  const [searchQuery, setSearchQuery] = useState("")

  // User view state
  const [hasAccess, setHasAccess] = useState(true)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [requestType, setRequestType] = useState<"single" | "multiple" | "clone">("single")
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [selectedCloneUser, setSelectedCloneUser] = useState<string>("")
  const [requestNotes, setRequestNotes] = useState("")

  // Admin request on behalf state
  const [adminRequestOpen, setAdminRequestOpen] = useState(false)
  const [adminSelectedUser, setAdminSelectedUser] = useState<string>("")

  // Detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    let filtered = requests.filter(
      (r) =>
        r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // Sort: pending first, then approved, then declined
    return filtered.sort((a, b) => {
      const order = { pending: 0, approved: 1, declined: 2 }
      return order[a.status] - order[b.status]
    })
  }, [requests, searchQuery])

  const handleStatusChange = useCallback((requestId: string, newStatus: "approved" | "declined") => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: newStatus,
              reviewedAt: new Date().toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }),
              reviewedBy: "You",
            }
          : r
      )
    )
  }, [])

  const handleSubmitRequest = useCallback(() => {
    const newRequest: AccessRequest = {
      id: `req-${Date.now()}`,
      requesterId: "user-current",
      requesterName: "Current User",
      requesterEmail: "current.user@company.com",
      requestType,
      pages: requestType === "clone" && selectedCloneUser
        ? systemUsers.find((u) => u.id === selectedCloneUser)?.pages || []
        : selectedPages,
      cloneUserId: requestType === "clone" ? selectedCloneUser : undefined,
      cloneUserName: requestType === "clone"
        ? systemUsers.find((u) => u.id === selectedCloneUser)?.name
        : undefined,
      status: "pending",
      requestedAt: new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      notes: requestNotes,
    }
    setRequests((prev) => [newRequest, ...prev])
    setRequestDialogOpen(false)
    setSelectedPages([])
    setSelectedCloneUser("")
    setRequestNotes("")
    setHasAccess(true)
  }, [requestType, selectedPages, selectedCloneUser, requestNotes])

  const handleAdminSubmitRequest = useCallback(() => {
    const targetUser = systemUsers.find((u) => u.id === adminSelectedUser)
    if (!targetUser) return

    const newRequest: AccessRequest = {
      id: `req-${Date.now()}`,
      requesterId: targetUser.id,
      requesterName: targetUser.name,
      requesterEmail: targetUser.email,
      requestType,
      pages: requestType === "clone" && selectedCloneUser
        ? systemUsers.find((u) => u.id === selectedCloneUser)?.pages || []
        : selectedPages,
      cloneUserId: requestType === "clone" ? selectedCloneUser : undefined,
      cloneUserName: requestType === "clone"
        ? systemUsers.find((u) => u.id === selectedCloneUser)?.name
        : undefined,
      status: "pending",
      requestedAt: new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      notes: `Requested by Admin on behalf of ${targetUser.name}. ${requestNotes}`,
    }
    setRequests((prev) => [newRequest, ...prev])
    setAdminRequestOpen(false)
    setAdminSelectedUser("")
    setSelectedPages([])
    setSelectedCloneUser("")
    setRequestNotes("")
    setRequestType("single")
  }, [adminSelectedUser, requestType, selectedPages, selectedCloneUser, requestNotes])

  const getPageName = (pageId: string) => {
    return availablePages.find((p) => p.id === pageId)?.name || pageId
  }

  const renderStatusBadge = (status: AccessRequest["status"]) => {
    const config = {
      pending: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", icon: Clock },
      approved: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", icon: CheckCircle2 },
      declined: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", icon: XCircle },
    }
    const { bg, text, icon: Icon } = config[status]
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bg} ${text}`}>
        <Icon className="h-3.5 w-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // User View - No Access Screen
  const renderNoAccessView = () => (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <Lock className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-foreground">Access Denied</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          You don&apos;t have permission to access this page. Request access to continue.
        </p>
        <button
          type="button"
          onClick={() => setRequestDialogOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Shield className="h-4 w-4" />
          Request Access
        </button>
      </div>
    </div>
  )

  // User View - Has Access / My Requests
  const renderUserView = () => (
    <div className="flex flex-1 flex-col overflow-hidden p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">My Access Requests</h2>
          <p className="text-sm text-muted-foreground">View and manage your access requests</p>
        </div>
        <button
          type="button"
          onClick={() => setHasAccess(false)}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ShieldAlert className="h-4 w-4" />
          Simulate No Access
        </button>
      </div>

      {/* User's requests */}
      <div className="flex-1 overflow-auto">
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pages</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Requested</th>
              </tr>
            </thead>
            <tbody>
              {requests
                .filter((r) => r.requesterId === "user-current" || r.requesterId === "user-5")
                .map((request) => (
                  <tr
                    key={request.id}
                    className="cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                    onClick={() => {
                      setSelectedRequest(request)
                      setDetailDialogOpen(true)
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                        {request.requestType === "clone" ? (
                          <>
                            <Copy className="h-3.5 w-3.5 text-primary" />
                            Clone
                          </>
                        ) : request.requestType === "multiple" ? (
                          <>
                            <Users className="h-3.5 w-3.5 text-primary" />
                            Multiple
                          </>
                        ) : (
                          <>
                            <Shield className="h-3.5 w-3.5 text-primary" />
                            Single
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">
                        {request.requestType === "clone"
                          ? `Clone ${request.cloneUserName}'s access`
                          : request.pages.length > 2
                            ? `${getPageName(request.pages[0])} +${request.pages.length - 1} more`
                            : request.pages.map(getPageName).join(", ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{renderStatusBadge(request.status)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{request.requestedAt}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Approver View
  const renderApproverView = () => (
    <div className="flex flex-1 flex-col overflow-hidden p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Access Requests</h2>
        <p className="text-sm text-muted-foreground">Review and approve access requests</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Requests table */}
      <div className="flex-1 overflow-auto">
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Requester</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pages</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Requested</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="w-32 px-4 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="group border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                >
                  <td
                    className="cursor-pointer px-4 py-3"
                    onClick={() => {
                      setSelectedRequest(request)
                      setDetailDialogOpen(true)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{request.requesterName}</div>
                        <div className="text-xs text-muted-foreground">{request.requesterEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground capitalize">{request.requestType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {request.requestType === "clone"
                        ? `Clone ${request.cloneUserName}`
                        : `${request.pages.length} page${request.pages.length > 1 ? "s" : ""}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{request.requestedAt}</td>
                  <td className="px-4 py-3">{renderStatusBadge(request.status)}</td>
                  <td className="px-4 py-3">
                    {request.status === "pending" ? (
                      <div className="relative">
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(request.id, e.target.value as "approved" | "declined")
                            }
                          }}
                          className="w-full appearance-none rounded-md border border-border bg-background px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Select...</option>
                          <option value="approved">Approve</option>
                          <option value="declined">Decline</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {request.reviewedBy && `by ${request.reviewedBy}`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Admin View
  const renderAdminView = () => (
    <div className="flex flex-1 flex-col overflow-hidden p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Admin - Access Management</h2>
          <p className="text-sm text-muted-foreground">View all requests and create requests for users</p>
        </div>
        <button
          type="button"
          onClick={() => setAdminRequestOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Request for User
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* All Requests table */}
      <div className="flex-1 overflow-auto">
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Requester</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pages</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Requested</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reviewed By</th>
                <th className="w-32 px-4 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="group border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                >
                  <td
                    className="cursor-pointer px-4 py-3"
                    onClick={() => {
                      setSelectedRequest(request)
                      setDetailDialogOpen(true)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{request.requesterName}</div>
                        <div className="text-xs text-muted-foreground">{request.requesterEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground capitalize">{request.requestType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {request.requestType === "clone"
                        ? `Clone ${request.cloneUserName}`
                        : `${request.pages.length} page${request.pages.length > 1 ? "s" : ""}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{request.requestedAt}</td>
                  <td className="px-4 py-3">{renderStatusBadge(request.status)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{request.reviewedBy || "-"}</td>
                  <td className="px-4 py-3">
                    {request.status === "pending" ? (
                      <div className="relative">
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(request.id, e.target.value as "approved" | "declined")
                            }
                          }}
                          className="w-full appearance-none rounded-md border border-border bg-background px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Select...</option>
                          <option value="approved">Approve</option>
                          <option value="declined">Decline</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Role Switcher Header */}
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">User Access Management</h1>
              <p className="text-sm text-muted-foreground">Manage page access and permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View as:</span>
            <div className="flex rounded-lg border border-border bg-background p-1">
              {(["user", "approver", "admin"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setViewRole(role)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                    viewRole === role
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content based on role */}
      {viewRole === "user" && !hasAccess && renderNoAccessView()}
      {viewRole === "user" && hasAccess && renderUserView()}
      {viewRole === "approver" && renderApproverView()}
      {viewRole === "admin" && renderAdminView()}

      {/* Request Access Dialog (User) */}
      {requestDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setRequestDialogOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Request Access</h3>
              </div>
              <button
                type="button"
                onClick={() => setRequestDialogOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Request type selection */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-foreground">
                  What would you like to access?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestType("single")
                      setSelectedPages([])
                    }}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      requestType === "single"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Shield className={`h-6 w-6 ${requestType === "single" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${requestType === "single" ? "text-primary" : "text-foreground"}`}>
                      This Page
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestType("multiple")
                      setSelectedPages([])
                    }}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      requestType === "multiple"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Users className={`h-6 w-6 ${requestType === "multiple" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${requestType === "multiple" ? "text-primary" : "text-foreground"}`}>
                      Several Pages
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestType("clone")
                      setSelectedPages([])
                    }}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      requestType === "clone"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Copy className={`h-6 w-6 ${requestType === "clone" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${requestType === "clone" ? "text-primary" : "text-foreground"}`}>
                      Clone User
                    </span>
                  </button>
                </div>
              </div>

              {/* Multiple pages selection */}
              {requestType === "multiple" && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">Select Pages</label>
                  <div className="max-h-48 overflow-auto rounded-lg border border-border">
                    {availablePages.map((page) => (
                      <label
                        key={page.id}
                        className="flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/20"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPages((prev) => [...prev, page.id])
                            } else {
                              setSelectedPages((prev) => prev.filter((id) => id !== page.id))
                            }
                          }}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                        />
                        <div>
                          <div className="text-sm font-medium text-foreground">{page.name}</div>
                          <div className="text-xs text-muted-foreground">{page.path}</div>
                        </div>
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {page.category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Clone user selection */}
              {requestType === "clone" && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">Clone Access From</label>
                  <div className="relative">
                    <select
                      value={selectedCloneUser}
                      onChange={(e) => setSelectedCloneUser(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Select a user...</option>
                      {systemUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.role} ({user.pages.length} pages)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {selectedCloneUser && (
                    <div className="mt-3 rounded-lg bg-muted/30 p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">Pages included:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {systemUsers
                          .find((u) => u.id === selectedCloneUser)
                          ?.pages.map((pageId) => (
                            <span
                              key={pageId}
                              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                            >
                              {getPageName(pageId)}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">Notes (optional)</label>
                <textarea
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="Explain why you need access..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setRequestDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={
                  (requestType === "multiple" && selectedPages.length === 0) ||
                  (requestType === "clone" && !selectedCloneUser)
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Request Dialog */}
      {adminRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setAdminRequestOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Request Access for User</h3>
              </div>
              <button
                type="button"
                onClick={() => setAdminRequestOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Select user */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">Select User</label>
                <div className="relative">
                  <select
                    value={adminSelectedUser}
                    onChange={(e) => setAdminSelectedUser(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select a user...</option>
                    {systemUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Request type selection */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-foreground">Access Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestType("single")
                      setSelectedPages([])
                    }}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      requestType === "single"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Shield className={`h-5 w-5 ${requestType === "single" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${requestType === "single" ? "text-primary" : "text-foreground"}`}>
                      Single Page
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestType("multiple")
                      setSelectedPages([])
                    }}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      requestType === "multiple"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Users className={`h-5 w-5 ${requestType === "multiple" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${requestType === "multiple" ? "text-primary" : "text-foreground"}`}>
                      Multiple
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestType("clone")
                      setSelectedPages([])
                    }}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      requestType === "clone"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Copy className={`h-5 w-5 ${requestType === "clone" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${requestType === "clone" ? "text-primary" : "text-foreground"}`}>
                      Clone User
                    </span>
                  </button>
                </div>
              </div>

              {/* Single page selection */}
              {requestType === "single" && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">Select Page</label>
                  <div className="relative">
                    <select
                      value={selectedPages[0] || ""}
                      onChange={(e) => setSelectedPages(e.target.value ? [e.target.value] : [])}
                      className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Select a page...</option>
                      {availablePages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Multiple pages selection */}
              {requestType === "multiple" && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">Select Pages</label>
                  <div className="max-h-40 overflow-auto rounded-lg border border-border">
                    {availablePages.map((page) => (
                      <label
                        key={page.id}
                        className="flex cursor-pointer items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-muted/20"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPages((prev) => [...prev, page.id])
                            } else {
                              setSelectedPages((prev) => prev.filter((id) => id !== page.id))
                            }
                          }}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm text-foreground">{page.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Clone user selection */}
              {requestType === "clone" && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">Clone Access From</label>
                  <div className="relative">
                    <select
                      value={selectedCloneUser}
                      onChange={(e) => setSelectedCloneUser(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Select a user...</option>
                      {systemUsers
                        .filter((u) => u.id !== adminSelectedUser)
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.pages.length} pages)
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Notes (optional)</label>
                <textarea
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="Add any relevant notes..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setAdminRequestOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdminSubmitRequest}
                disabled={
                  !adminSelectedUser ||
                  (requestType === "single" && selectedPages.length === 0) ||
                  (requestType === "multiple" && selectedPages.length === 0) ||
                  (requestType === "clone" && !selectedCloneUser)
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Detail Dialog */}
      {detailDialogOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDetailDialogOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">Request Details</h3>
              <button
                type="button"
                onClick={() => setDetailDialogOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{selectedRequest.requesterName}</div>
                  <div className="text-sm text-muted-foreground">{selectedRequest.requesterEmail}</div>
                </div>
                <div className="ml-auto">{renderStatusBadge(selectedRequest.status)}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium uppercase text-muted-foreground">Request Type</span>
                  <p className="mt-1 text-sm text-foreground capitalize">
                    {selectedRequest.requestType}
                    {selectedRequest.requestType === "clone" && ` - ${selectedRequest.cloneUserName}`}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium uppercase text-muted-foreground">Pages Requested</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedRequest.pages.map((pageId) => (
                      <span
                        key={pageId}
                        className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
                      >
                        {getPageName(pageId)}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium uppercase text-muted-foreground">Requested At</span>
                  <p className="mt-1 text-sm text-foreground">{selectedRequest.requestedAt}</p>
                </div>

                {selectedRequest.notes && (
                  <div>
                    <span className="text-xs font-medium uppercase text-muted-foreground">Notes</span>
                    <p className="mt-1 text-sm text-foreground">{selectedRequest.notes}</p>
                  </div>
                )}

                {selectedRequest.reviewedAt && (
                  <div>
                    <span className="text-xs font-medium uppercase text-muted-foreground">Reviewed</span>
                    <p className="mt-1 text-sm text-foreground">
                      {selectedRequest.reviewedAt} by {selectedRequest.reviewedBy}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              {selectedRequest.status === "pending" && (viewRole === "approver" || viewRole === "admin") && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "declined")
                      setDetailDialogOpen(false)
                    }}
                    className="flex items-center gap-2 rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "approved")
                      setDetailDialogOpen(false)
                    }}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                </>
              )}
              {(selectedRequest.status !== "pending" || viewRole === "user") && (
                <button
                  type="button"
                  onClick={() => setDetailDialogOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
