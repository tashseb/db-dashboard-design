"use client"

import {
  Database,
  FileText,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import type { DatabaseReference, DocumentFile } from "@/lib/data"

export interface CreateProcessData {
  name: string
  category: string
  description: string
  trigger: string
  contact: string
  dataPopulation: string
  databasesUsed: DatabaseReference[]
  documents: DocumentFile[]
}

interface CreateProcessModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateProcessData) => void
}

type Step = "details" | "database" | "documents"

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "database", label: "Database" },
  { id: "documents", label: "Documents" },
]

export function CreateProcessModal({
  open,
  onClose,
  onSubmit,
}: CreateProcessModalProps) {
  const [step, setStep] = useState<Step>("details")

  // Details
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [trigger, setTrigger] = useState("")
  const [contact, setContact] = useState("")

  // Database
  const [dataPopulation, setDataPopulation] = useState("")
  const [dbRefs, setDbRefs] = useState<DatabaseReference[]>([])
  const [newDb, setNewDb] = useState("")
  const [newTable, setNewTable] = useState("")
  const [newUsage, setNewUsage] = useState("")

  // Documents
  const [docs, setDocs] = useState<DocumentFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const overlayRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setStep("details")
      setName("")
      setCategory("")
      setDescription("")
      setTrigger("")
      setContact("")
      setDataPopulation("")
      setDbRefs([])
      setNewDb("")
      setNewTable("")
      setNewUsage("")
      setDocs([])
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  // Database ref helpers
  const addDbRef = () => {
    if (!newDb.trim() || !newTable.trim()) return
    setDbRefs((prev) => [
      ...prev,
      {
        database: newDb.trim(),
        table: newTable.trim(),
        usage: newUsage.trim(),
        server: "",
        details: "",
        connection: "",
      },
    ])
    setNewDb("")
    setNewTable("")
    setNewUsage("")
  }

  const removeDbRef = (index: number) => {
    setDbRefs((prev) => prev.filter((_, i) => i !== index))
  }

  // Document helpers
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const newDocs: DocumentFile[] = Array.from(files).map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name,
      size:
        f.size > 1048576
          ? `${(f.size / 1048576).toFixed(1)} MB`
          : `${(f.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
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

  if (!open) return null

  const canSubmit = name.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      trigger: trigger.trim(),
      contact: contact.trim(),
      dataPopulation: dataPopulation.trim(),
      databasesUsed: dbRefs,
      documents: docs,
    })
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step)
  const isLast = stepIndex === STEPS.length - 1
  const isFirst = stepIndex === 0

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Create new process"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] sm:items-center sm:pt-0"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="absolute inset-0 bg-foreground/40" />

      <div className="relative mx-4 flex w-full max-w-2xl flex-col rounded-xl border border-border bg-background shadow-xl sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Create New Process
              </h2>
              <p className="text-xs text-muted-foreground">
                Document a new page process
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex border-b border-border">
          {STEPS.map((s, i) => {
            const isActive = s.id === step
            const isPast = i < stepIndex
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-primary text-primary"
                    : isPast
                      ? "text-foreground hover:bg-muted/50"
                      : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isPast
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
          {/* Step 1 - Details */}
          {step === "details" && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="cp-name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="cp-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Checkout Flow"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label
                  htmlFor="cp-category"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Category
                </label>
                <input
                  id="cp-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Customer, Admin"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label
                  htmlFor="cp-contact"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Contact
                </label>
                <input
                  id="cp-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. team@company.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="cp-description"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Description
                </label>
                <textarea
                  id="cp-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe what this process does..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="cp-trigger"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Trigger
                </label>
                <textarea
                  id="cp-trigger"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  rows={2}
                  placeholder="What triggers this process? e.g. manual navigation, cron job, webhook..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          )}

          {/* Step 2 - Database */}
          {step === "database" && (
            <div className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="cp-data-pop"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  How Data is Populated
                </label>
                <textarea
                  id="cp-data-pop"
                  value={dataPopulation}
                  onChange={(e) => setDataPopulation(e.target.value)}
                  rows={3}
                  placeholder="Describe how data flows into this page..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-foreground">
                  Databases & Tables Used
                </label>

                {dbRefs.length > 0 && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                            Database
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                            Table
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                            Usage
                          </th>
                          <th className="w-10 px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {dbRefs.map((ref, i) => (
                          <tr
                            key={`${ref.database}-${ref.table}-${i}`}
                            className="border-b border-border last:border-b-0"
                          >
                            <td className="px-3 py-2 text-sm font-medium text-foreground">
                              {ref.database}
                            </td>
                            <td className="px-3 py-2 font-mono text-sm text-muted-foreground">
                              {ref.table}
                            </td>
                            <td className="px-3 py-2 text-sm text-foreground">
                              {ref.usage}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => removeDbRef(i)}
                                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Remove reference"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="rounded-lg border border-dashed border-border p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Add Reference
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      value={newDb}
                      onChange={(e) => setNewDb(e.target.value)}
                      placeholder="Database name"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="text"
                      value={newTable}
                      onChange={(e) => setNewTable(e.target.value)}
                      placeholder="Table name"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="text"
                      value={newUsage}
                      onChange={(e) => setNewUsage(e.target.value)}
                      placeholder="Usage description"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addDbRef}
                    disabled={!newDb.trim() || !newTable.trim()}
                    className="mt-3 flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Documents */}
          {step === "documents" && (
            <div className="flex flex-col gap-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {docs.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-border">
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
                            {doc.size}
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
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40 hover:bg-muted/20"
                }`}
              >
                <UploadCloud
                  className={`mb-3 h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground/40"}`}
                />
                <p className="text-sm font-medium text-foreground">
                  {docs.length > 0
                    ? "Drop more files or click to add"
                    : "Drop files here or click to upload"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, DOC, MD, FIG, or any file type
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div>
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStep(STEPS[stepIndex - 1].id)}
                className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Database className="h-4 w-4" />
                Create Process
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(STEPS[stepIndex + 1].id)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
