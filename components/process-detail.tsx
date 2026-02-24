"use client"

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Database,
  Eye,
  Info,
  LayoutDashboard,
  RotateCcw,
  Save,
  Search,
  Shield,
  Users,
} from "lucide-react"
import { useState } from "react"
import type { ProcessInfo, IssueRecord } from "@/lib/data"

interface ProcessDetailProps {
  process: ProcessInfo
  databaseName: string
}

function SeverityBadge({ severity }: { severity: IssueRecord["severity"] }) {
  const styles = {
    critical: "border-red-200 bg-red-50 text-red-700",
    high: "border-orange-200 bg-orange-50 text-orange-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-border bg-muted text-muted-foreground",
  }
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase ${styles[severity]}`}
    >
      {severity}
    </span>
  )
}

function StatusBadge({ status }: { status: IssueRecord["status"] }) {
  const styles = {
    open: "border-red-200 bg-red-50 text-red-700",
    investigating: "border-amber-200 bg-amber-50 text-amber-700",
    resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }
  const icons = {
    open: <AlertTriangle className="h-3 w-3" />,
    investigating: <Search className="h-3 w-3" />,
    resolved: <CheckCircle2 className="h-3 w-3" />,
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  )
}

function IssueRow({ issue }: { issue: IssueRecord }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/20 sm:items-center"
      >
        {expanded ? (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground sm:mt-0" />
        ) : (
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground sm:mt-0" />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <span className="shrink-0 text-xs font-mono text-muted-foreground sm:w-20">
            {issue.id}
          </span>
          <span className="min-w-0 flex-1 text-sm font-medium text-foreground sm:truncate">
            {issue.title}
          </span>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SeverityBadge severity={issue.severity} />
            <StatusBadge status={issue.status} />
          </div>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border bg-muted/10 px-4 py-4 pl-11">
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {issue.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Reported: {issue.reportedDate}
            </span>
            {issue.resolvedDate && (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Resolved: {issue.resolvedDate}
              </span>
            )}
          </div>
          {issue.solution && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <Shield className="h-3.5 w-3.5" />
                Solution
              </div>
              <p className="text-sm leading-relaxed text-emerald-800">
                {issue.solution}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ProcessDetail({ process, databaseName }: ProcessDetailProps) {
  const openCount = process.issues.filter((i) => i.status !== "resolved").length
  const resolvedCount = process.issues.filter(
    (i) => i.status === "resolved",
  ).length

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4 shrink-0" />
              <span className="truncate">{databaseName}</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="truncate font-medium text-primary">{process.name}</span>
            </div>
            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {process.name}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:px-4"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* General Information */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          General Information
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Page Name
            </label>
            <input
              type="text"
              defaultValue={process.name}
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Page Path
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-foreground">
                {process.pagePath}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            defaultValue={process.description}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Main Functionality
          </label>
          <textarea
            defaultValue={process.mainFunctionality}
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Data Population */}
      <div className="px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Data Population
        </h2>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            How Data is Populated
          </label>
          <textarea
            defaultValue={process.dataPopulation}
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <label className="mb-3 block text-sm font-medium text-foreground">
          Databases & Tables Used
        </label>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Database
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Table
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody>
              {process.databasesUsed.map((ref) => (
                <tr
                  key={`${ref.database}-${ref.table}`}
                  className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Database className="h-3.5 w-3.5 text-primary" />
                      {ref.database}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {ref.table}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {ref.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Users */}
      <div className="px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Main Users
        </h2>
        <div className="flex flex-wrap gap-2">
          {process.mainUsers.map((user) => (
            <div
              key={user}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5"
            >
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {user}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Tracking */}
      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Issue Tracking
          </h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              {openCount} open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              {resolvedCount} resolved
            </span>
          </div>
        </div>

        {process.issues.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="hidden items-center gap-4 border-b border-border bg-muted/40 px-4 py-2.5 sm:flex">
              <span className="w-20 text-xs font-medium text-muted-foreground">
                ID
              </span>
              <span className="flex-1 text-xs font-medium text-muted-foreground">
                Title
              </span>
              <span className="w-40 text-right text-xs font-medium text-muted-foreground">
                Severity / Status
              </span>
            </div>
            {process.issues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <Info className="mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No issues recorded for this process
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
