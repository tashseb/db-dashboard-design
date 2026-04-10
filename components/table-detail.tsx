"use client"

import { useState } from "react"
import {
  Calendar,
  Database,
  Eye,
  FileCode2,
  Hash,
  KeyRound,
  Layers,
  RotateCcw,
  Save,
  Workflow,
  X,
  Zap,
} from "lucide-react"
import type { TableInfo } from "@/lib/data"
import { tableReferences } from "@/lib/data"

interface TableDetailProps {
  table: TableInfo
  databaseName: string
}

// Helper to get icon for code object type
function getCodeObjectIcon(type: string) {
  switch (type) {
    case "procedure":
      return <Zap className="h-4 w-4 text-amber-500" />
    case "function":
      return <FileCode2 className="h-4 w-4 text-blue-500" />
    case "view":
      return <Layers className="h-4 w-4 text-emerald-500" />
    case "trigger":
      return <Zap className="h-4 w-4 text-purple-500" />
    default:
      return <FileCode2 className="h-4 w-4 text-muted-foreground" />
  }
}

// Helper to get badge color for usage type
function getUsageBadgeClass(usageType: string) {
  switch (usageType) {
    case "read":
    case "select":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
    case "write":
    case "insert":
      return "border-blue-500/30 bg-blue-500/10 text-blue-600"
    case "read/write":
    case "update":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600"
    case "delete":
      return "border-red-500/30 bg-red-500/10 text-red-600"
    case "join":
      return "border-purple-500/30 bg-purple-500/10 text-purple-600"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

export function TableDetail({ table, databaseName }: TableDetailProps) {
  const [referencesDialogOpen, setReferencesDialogOpen] = useState(false)
  
  const references = tableReferences[table.name] || { processes: [], codeObjects: [] }
  const totalReferences = references.processes.length + references.codeObjects.length

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="border-b border-border px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4 shrink-0" />
              <span className="truncate">{databaseName}</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="truncate font-medium text-primary">{table.name}</span>
            </div>
            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">{table.name}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setReferencesDialogOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-transparent px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 sm:px-4"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">References</span>
              {totalReferences > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold">
                  {totalReferences}
                </span>
              )}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:px-4"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          General Information
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Table Name
            </label>
            <input
              type="text"
              defaultValue={table.name}
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Estimated Row Count
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {table.estimatedRowCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            defaultValue={table.description}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Last Updated
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{table.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Schema Definition
        </h2>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Column Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Data Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Nullable
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Key
                </th>
              </tr>
            </thead>
            <tbody>
              {table.columns.map((col) => (
                <tr
                  key={col.name}
                  className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {col.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {col.dataType}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                        col.nullable
                          ? "border-border bg-muted text-muted-foreground"
                          : "border-border bg-muted text-foreground"
                      }`}
                    >
                      {col.nullable ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {col.isPrimaryKey && (
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* References Dialog */}
      {referencesDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setReferencesDialogOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setReferencesDialogOpen(false)}
          />
          <div className="relative z-10 mx-4 flex max-h-[85vh] w-full max-w-4xl flex-col rounded-xl border border-border bg-background shadow-2xl">
            {/* Dialog Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Table References
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-mono">{table.name}</span> is referenced by {totalReferences} object{totalReferences !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReferencesDialogOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Processes Section */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Processes ({references.processes.length})
                  </h4>
                </div>
                {references.processes.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Process Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Platform
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Usage
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Owner
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {references.processes.map((proc) => (
                          <tr
                            key={proc.processName}
                            className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                          >
                            <td className="px-4 py-3">
                              <div>
                                <span className="text-sm font-medium text-foreground">
                                  {proc.processName}
                                </span>
                                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                  {proc.description}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              {proc.platform}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                                {proc.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${getUsageBadgeClass(proc.usageType)}`}>
                                {proc.usageType}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {proc.owner}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8">
                    <Workflow className="mb-2 h-6 w-6 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No processes reference this table
                    </p>
                  </div>
                )}
              </div>

              {/* Code Objects Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Procedures, Functions & Views ({references.codeObjects.length})
                  </h4>
                </div>
                {references.codeObjects.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Schema
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Operation
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Last Modified
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {references.codeObjects.map((obj) => (
                          <tr
                            key={obj.name}
                            className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                          >
                            <td className="px-4 py-3">
                              <span className="text-sm font-mono font-medium text-foreground">
                                {obj.name}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {getCodeObjectIcon(obj.type)}
                                <span className="text-sm capitalize text-foreground">
                                  {obj.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                              {obj.schema}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold uppercase ${getUsageBadgeClass(obj.usageType)}`}>
                                {obj.usageType}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {obj.lastModified}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8">
                    <FileCode2 className="mb-2 h-6 w-6 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No procedures, functions, or views reference this table
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="shrink-0 border-t border-border px-6 py-4">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setReferencesDialogOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
