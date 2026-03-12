"use client"

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  FileText,
  Info,
  Link2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Server,
  Shield,
  Trash2,
  UploadCloud,
  User,
  X,
} from "lucide-react"
import { useState, useRef, useCallback } from "react"
import type { ProcessInfo, IssueRecord, DocumentFile, DatabaseReference } from "@/lib/data"
import { TableAutocomplete } from "./table-autocomplete"

interface ProcessDetailProps {
  process: ProcessInfo
  databaseName: string
  onCreateProcess?: () => void
}

// --- Sub-components ---

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

function ReadOnlyField({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ElementType
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-sm text-foreground">{value}</span>
      </div>
    </div>
  )
}

function DocumentDropZone({
  documents: initialDocs,
}: {
  documents: DocumentFile[]
}) {
  const [docs, setDocs] = useState<DocumentFile[]>(initialDocs)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const newDocs: DocumentFile[] = Array.from(files).map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name,
      size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      uploadedBy: "You",
    }))
    setDocs((prev) => [...prev, ...newDocs])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const removeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  if (docs.length === 0) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/40 hover:bg-muted/20"
          }`}
        >
          <UploadCloud className={`mb-3 h-10 w-10 ${isDragging ? "text-primary" : "text-muted-foreground/40"}`} />
          <p className="text-sm font-medium text-foreground">
            Drop files here or click to upload
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, DOC, MD, FIG, or any file type
          </p>
        </button>
      </>
    )
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-lg border transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border"}`}
      >
        <div className="divide-y divide-border">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/20"
            >
              <FileText className="h-5 w-5 shrink-0 text-primary/70" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {doc.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {doc.size} &middot; {doc.uploadedBy} &middot; {doc.uploadedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${doc.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 border-t border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
        >
          <UploadCloud className="h-4 w-4" />
          Add more files
        </button>
      </div>
    </>
  )
}

// --- Main component ---

export function ProcessDetail({ process, databaseName, onCreateProcess }: ProcessDetailProps) {
  const [tables, setTables] = useState<DatabaseReference[]>(process.databasesUsed)

  const handleAddTable = useCallback((table: DatabaseReference) => {
    setTables((prev) => [...prev, table])
  }, [])

  const handleRemoveTable = useCallback((database: string, tableName: string) => {
    setTables((prev) => prev.filter((t) => !(t.database === database && t.table === tableName)))
  }, [])

  const handleUpdateUsage = useCallback((database: string, tableName: string, usage: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.database === database && t.table === tableName ? { ...t, usage } : t
      )
    )
  }, [])

  const openCount = process.issues.filter(
    (i) => i.status !== "resolved",
  ).length
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
              <span className="truncate font-medium text-primary">
                {process.name}
              </span>
            </div>
            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {process.name}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {onCreateProcess && (
              <button
                type="button"
                onClick={onCreateProcess}
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-transparent px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 sm:px-4"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </button>
            )}
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

      {/* Read-only meta */}
      <div className="border-b border-border px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField
            label="Last Updated"
            value={process.lastUpdated}
            icon={Clock}
          />
          <ReadOnlyField
            label="Updated By"
            value={process.updatedBy}
            icon={User}
          />
        </div>
      </div>

      {/* Editable fields */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          General Information
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              type="text"
              defaultValue={process.name}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Category
            </label>
            <input
              type="text"
              defaultValue={process.category}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            defaultValue={process.description}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Trigger
          </label>
          <textarea
            defaultValue={process.trigger}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Contact
          </label>
          <input
            type="text"
            defaultValue={process.contact}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Database section */}
      <div className="px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Database
        </h2>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            How Data is Populated
          </label>
          <textarea
            defaultValue={process.dataPopulation}
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <label className="mb-3 block text-sm font-medium text-foreground">
          Databases & Tables Used
        </label>

        {/* Autocomplete search */}
        <TableAutocomplete existingTables={tables} onAddTable={handleAddTable} />

        {/* Table list */}
        {tables.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Server
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Database
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Table
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Connection
                  </th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {tables.map((ref) => (
                  <tr
                    key={`${ref.database}-${ref.table}`}
                    className="group border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Server className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[140px]" title={ref.server}>
                          {ref.server}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Database className="h-3.5 w-3.5 text-primary shrink-0" />
                        {ref.database}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {ref.table}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px]">
                      <span className="truncate block" title={ref.details}>
                        {ref.details}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                        <Link2 className="h-3 w-3" />
                        {ref.connection.split("|")[0].trim()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveTable(ref.database, ref.table)}
                        className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                        aria-label={`Remove ${ref.table}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <Database className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No tables added yet. Search above to add tables.
            </p>
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Documentation
        </h2>
        <DocumentDropZone documents={process.documents} />
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
