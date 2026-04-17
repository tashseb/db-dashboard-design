"use client"

import { useState, useCallback } from "react"
import {
  Check,
  Copy,
  Database,
  FileText,
  FolderCog as FolderCode,
  KeyRound,
  PanelLeft,
  PanelLeftClose,
  Columns2,
  Columns3,
  Pencil,
  Plus,
  Server,
  Trash2,
  Users,
  Workflow,
  X,
} from "lucide-react"
import { vaultCredentials, type DatabaseCredential, type ServerCredential, type ContactInfo } from "@/lib/data"

const tabs = [
  { label: "Table", icon: Database, id: "table" },
  { label: "Stored Procedures", icon: FolderCode, id: "stored-procedures" },
  { label: "Process", icon: Workflow, id: "process" },
  { label: "Documents", icon: FileText, id: "documents" },
] as const

const vaultTabs = [
  { label: "Databases", icon: Database, id: "databases" },
  { label: "Servers", icon: Server, id: "servers" },
  { label: "Contacts", icon: Users, id: "contacts" },
] as const

const dbTypes = ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "MongoDB"] as const
const serverTypes = ["SSH", "FTP", "SFTP", "RDP"] as const
const environments = ["Production", "Staging", "Development"] as const

interface TopNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
  schemaOpen: boolean
  onToggleSchema: () => void
  hideSchemaToggle?: boolean
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Failed to copy")
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

function MaskedPassword({ password }: { password: string }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs">
        {revealed ? password : "••••••••••••"}
      </span>
      <button
        type="button"
        onClick={() => setRevealed(!revealed)}
        className="text-xs text-primary hover:underline"
      >
        {revealed ? "Hide" : "Show"}
      </button>
      <CopyButton text={password} />
    </div>
  )
}

export function TopNav({
  activeTab,
  onTabChange,
  sidebarOpen,
  onToggleSidebar,
  schemaOpen,
  onToggleSchema,
  hideSchemaToggle,
}: TopNavProps) {
  const [vaultOpen, setVaultOpen] = useState(false)
  const [activeVaultTab, setActiveVaultTab] = useState<"databases" | "servers" | "contacts">("databases")

  // Vault data state
  const [databases, setDatabases] = useState<DatabaseCredential[]>(vaultCredentials.databases)
  const [servers, setServers] = useState<ServerCredential[]>(vaultCredentials.servers)
  const [contacts, setContacts] = useState<ContactInfo[]>(vaultCredentials.contacts)

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DatabaseCredential | ServerCredential | ContactInfo | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Form state for databases
  const [dbForm, setDbForm] = useState<Omit<DatabaseCredential, "id">>({
    name: "",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
    type: "PostgreSQL",
    environment: "Development",
  })

  // Form state for servers
  const [serverForm, setServerForm] = useState<Omit<ServerCredential, "id">>({
    name: "",
    host: "",
    port: "",
    username: "",
    password: "",
    type: "SSH",
    environment: "Development",
  })

  // Form state for contacts
  const [contactForm, setContactForm] = useState<Omit<ContactInfo, "id">>({
    name: "",
    role: "",
    email: "",
    phone: "",
    team: "",
  })

  // Open add modal
  const handleAdd = useCallback(() => {
    setIsAdding(true)
    setEditingItem(null)
    if (activeVaultTab === "databases") {
      setDbForm({ name: "", host: "", port: "5432", database: "", username: "", password: "", type: "PostgreSQL", environment: "Development" })
    } else if (activeVaultTab === "servers") {
      setServerForm({ name: "", host: "", port: "22", username: "", password: "", type: "SSH", environment: "Development" })
    } else {
      setContactForm({ name: "", role: "", email: "", phone: "", team: "" })
    }
    setEditModalOpen(true)
  }, [activeVaultTab])

  // Open edit modal
  const handleEdit = useCallback((item: DatabaseCredential | ServerCredential | ContactInfo) => {
    setIsAdding(false)
    setEditingItem(item)
    if (activeVaultTab === "databases") {
      const db = item as DatabaseCredential
      setDbForm({ name: db.name, host: db.host, port: db.port, database: db.database, username: db.username, password: db.password, type: db.type, environment: db.environment })
    } else if (activeVaultTab === "servers") {
      const srv = item as ServerCredential
      setServerForm({ name: srv.name, host: srv.host, port: srv.port, username: srv.username, password: srv.password, type: srv.type, environment: srv.environment })
    } else {
      const ct = item as ContactInfo
      setContactForm({ name: ct.name, role: ct.role, email: ct.email, phone: ct.phone || "", team: ct.team })
    }
    setEditModalOpen(true)
  }, [activeVaultTab])

  // Open delete confirmation
  const handleDeleteClick = useCallback((item: DatabaseCredential | ServerCredential | ContactInfo) => {
    setEditingItem(item)
    setDeleteModalOpen(true)
  }, [])

  // Confirm delete
  const handleDeleteConfirm = useCallback(() => {
    if (!editingItem) return
    if (activeVaultTab === "databases") {
      setDatabases((prev) => prev.filter((d) => d.id !== editingItem.id))
    } else if (activeVaultTab === "servers") {
      setServers((prev) => prev.filter((s) => s.id !== editingItem.id))
    } else {
      setContacts((prev) => prev.filter((c) => c.id !== editingItem.id))
    }
    setDeleteModalOpen(false)
    setEditingItem(null)
  }, [activeVaultTab, editingItem])

  // Save (add or update)
  const handleSave = useCallback(() => {
    if (activeVaultTab === "databases") {
      if (isAdding) {
        const newDb: DatabaseCredential = { ...dbForm, id: `db-${Date.now()}` }
        setDatabases((prev) => [...prev, newDb])
      } else if (editingItem) {
        setDatabases((prev) => prev.map((d) => d.id === editingItem.id ? { ...dbForm, id: editingItem.id } : d))
      }
    } else if (activeVaultTab === "servers") {
      if (isAdding) {
        const newSrv: ServerCredential = { ...serverForm, id: `srv-${Date.now()}` }
        setServers((prev) => [...prev, newSrv])
      } else if (editingItem) {
        setServers((prev) => prev.map((s) => s.id === editingItem.id ? { ...serverForm, id: editingItem.id } : s))
      }
    } else {
      if (isAdding) {
        const newContact: ContactInfo = { ...contactForm, id: `ct-${Date.now()}` }
        setContacts((prev) => [...prev, newContact])
      } else if (editingItem) {
        setContacts((prev) => prev.map((c) => c.id === editingItem.id ? { ...contactForm, id: editingItem.id } : c))
      }
    }
    setEditModalOpen(false)
    setEditingItem(null)
  }, [activeVaultTab, isAdding, editingItem, dbForm, serverForm, contactForm])

  return (
    <>
      <header className="flex shrink-0 flex-col border-b border-border bg-background sm:h-14 sm:flex-row sm:items-center">
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Database className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">DataScout</span>
          </div>
          <div className="flex items-center gap-1 sm:hidden">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={sidebarOpen ? "Close database sidebar" : "Open database sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </button>
            {!hideSchemaToggle && (
              <button
                type="button"
                onClick={onToggleSchema}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={schemaOpen ? "Close schema panel" : "Open schema panel"}
              >
                {schemaOpen ? (
                  <Columns3 className="h-4 w-4" />
                ) : (
                  <Columns2 className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between overflow-x-auto border-t border-border sm:h-full sm:flex-1 sm:border-t-0">
          <nav className="flex h-full items-end gap-1 px-3 sm:px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-t-md px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
                    isActive
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="flex items-center gap-1 pr-3">
            {/* Vault Button */}
            <button
              type="button"
              onClick={() => setVaultOpen(true)}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <KeyRound className="h-4 w-4" />
              <span className="hidden sm:inline">Vault</span>
            </button>
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={sidebarOpen ? "Close database sidebar" : "Open database sidebar"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeft className="h-4 w-4" />
                )}
              </button>
              {!hideSchemaToggle && (
                <button
                  type="button"
                  onClick={onToggleSchema}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={schemaOpen ? "Close schema panel" : "Open schema panel"}
                >
                  {schemaOpen ? (
                    <Columns3 className="h-4 w-4" />
                  ) : (
                    <Columns2 className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="hidden pr-5 sm:block">
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </header>

      {/* Vault Dialog */}
      {vaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setVaultOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setVaultOpen(false)}
          />
          <div className="relative z-10 mx-4 flex max-h-[85vh] w-full max-w-4xl flex-col rounded-xl border border-border bg-background shadow-2xl">
            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Credential Vault</h2>
                  <p className="text-sm text-muted-foreground">
                    Securely stored credentials and contact information
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVaultOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Vault Tabs */}
            <div className="flex items-center justify-between border-b border-border px-6">
              <nav className="flex gap-1">
                {vaultTabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeVaultTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveVaultTab(tab.id as typeof activeVaultTab)}
                      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {/* Vault Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeVaultTab === "databases" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Host</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Database</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Password</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Env</th>
                        <th className="w-20 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {databases.map((db) => (
                        <tr key={db.id} className="group border-b border-border last:border-b-0 hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">{db.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="max-w-[140px] truncate font-mono text-xs text-muted-foreground" title={db.host}>
                                {db.host}:{db.port}
                              </span>
                              <CopyButton text={`${db.host}:${db.port}`} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-muted-foreground">{db.database}</span>
                              <CopyButton text={db.database} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-foreground">{db.username}</span>
                              <CopyButton text={db.username} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <MaskedPassword password={db.password} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              db.environment === "Production"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : db.environment === "Staging"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}>
                              {db.environment}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => handleEdit(db)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(db)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {databases.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No database credentials yet. Click Add to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeVaultTab === "servers" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Host</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Password</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Env</th>
                        <th className="w-20 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map((srv) => (
                        <tr key={srv.id} className="group border-b border-border last:border-b-0 hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">{srv.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="max-w-[160px] truncate font-mono text-xs text-muted-foreground" title={srv.host}>
                                {srv.host}:{srv.port}
                              </span>
                              <CopyButton text={`${srv.host}:${srv.port}`} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {srv.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-foreground">{srv.username}</span>
                              <CopyButton text={srv.username} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <MaskedPassword password={srv.password} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              srv.environment === "Production"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : srv.environment === "Staging"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}>
                              {srv.environment}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => handleEdit(srv)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(srv)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {servers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No server credentials yet. Click Add to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeVaultTab === "contacts" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Team</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="w-20 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="group border-b border-border last:border-b-0 hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {contact.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="text-sm font-medium text-foreground">{contact.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{contact.role}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {contact.team}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">
                                {contact.email}
                              </a>
                              <CopyButton text={contact.email} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {contact.phone ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">{contact.phone}</span>
                                <CopyButton text={contact.phone} />
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground/50">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => handleEdit(contact)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(contact)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {contacts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No contacts yet. Click Add to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setEditModalOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-md rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                {isAdding ? "Add" : "Edit"} {activeVaultTab === "databases" ? "Database" : activeVaultTab === "servers" ? "Server" : "Contact"}
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              {activeVaultTab === "databases" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                    <input
                      type="text"
                      value={dbForm.name}
                      onChange={(e) => setDbForm({ ...dbForm, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Production Main DB"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Host</label>
                      <input
                        type="text"
                        value={dbForm.host}
                        onChange={(e) => setDbForm({ ...dbForm, host: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="db.example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Port</label>
                      <input
                        type="text"
                        value={dbForm.port}
                        onChange={(e) => setDbForm({ ...dbForm, port: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="5432"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Database</label>
                    <input
                      type="text"
                      value={dbForm.database}
                      onChange={(e) => setDbForm({ ...dbForm, database: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="my_database"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Username</label>
                    <input
                      type="text"
                      value={dbForm.username}
                      onChange={(e) => setDbForm({ ...dbForm, username: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="db_user"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                    <input
                      type="password"
                      value={dbForm.password}
                      onChange={(e) => setDbForm({ ...dbForm, password: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
                      <select
                        value={dbForm.type}
                        onChange={(e) => setDbForm({ ...dbForm, type: e.target.value as DatabaseCredential["type"] })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {dbTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Environment</label>
                      <select
                        value={dbForm.environment}
                        onChange={(e) => setDbForm({ ...dbForm, environment: e.target.value as DatabaseCredential["environment"] })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {environments.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeVaultTab === "servers" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                    <input
                      type="text"
                      value={serverForm.name}
                      onChange={(e) => setServerForm({ ...serverForm, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Production App Server"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Host</label>
                      <input
                        type="text"
                        value={serverForm.host}
                        onChange={(e) => setServerForm({ ...serverForm, host: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="server.example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Port</label>
                      <input
                        type="text"
                        value={serverForm.port}
                        onChange={(e) => setServerForm({ ...serverForm, port: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="22"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Username</label>
                    <input
                      type="text"
                      value={serverForm.username}
                      onChange={(e) => setServerForm({ ...serverForm, username: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="deploy_user"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                    <input
                      type="password"
                      value={serverForm.password}
                      onChange={(e) => setServerForm({ ...serverForm, password: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
                      <select
                        value={serverForm.type}
                        onChange={(e) => setServerForm({ ...serverForm, type: e.target.value as ServerCredential["type"] })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {serverTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Environment</label>
                      <select
                        value={serverForm.environment}
                        onChange={(e) => setServerForm({ ...serverForm, environment: e.target.value as ServerCredential["environment"] })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {environments.map((env) => (
                          <option key={env} value={env}>{env}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeVaultTab === "contacts" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
                    <input
                      type="text"
                      value={contactForm.role}
                      onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Senior Developer"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Team</label>
                    <input
                      type="text"
                      value={contactForm.team}
                      onChange={(e) => setContactForm({ ...contactForm, team: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Platform Team"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Phone (optional)</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {isAdding ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDeleteModalOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-xl border border-border bg-background shadow-2xl">
            <div className="px-6 py-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Delete {activeVaultTab === "databases" ? "Database" : activeVaultTab === "servers" ? "Server" : "Contact"}</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete <span className="font-medium text-foreground">{editingItem && "name" in editingItem ? editingItem.name : ""}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
