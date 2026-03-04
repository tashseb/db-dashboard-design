"use client"

import { Database, Plus, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface CreateProcessModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    category: string
    description: string
    trigger: string
    contact: string
  }) => void
}

export function CreateProcessModal({
  open,
  onClose,
  onSubmit,
}: CreateProcessModalProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [trigger, setTrigger] = useState("")
  const [contact, setContact] = useState("")
  const overlayRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName("")
      setCategory("")
      setDescription("")
      setTrigger("")
      setContact("")
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

  if (!open) return null

  const canSubmit = name.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      trigger: trigger.trim(),
      contact: contact.trim(),
    })
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Create new process"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:items-center sm:pt-0"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40" />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg rounded-xl border border-border bg-background shadow-xl sm:mx-0">
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

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="process-name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="process-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Checkout Flow"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label
                  htmlFor="process-category"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Category
                </label>
                <input
                  id="process-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Customer, Admin"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label
                  htmlFor="process-contact"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Contact
                </label>
                <input
                  id="process-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. team@company.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="process-description"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Description
                </label>
                <textarea
                  id="process-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe what this process does..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="process-trigger"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Trigger
                </label>
                <textarea
                  id="process-trigger"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  rows={2}
                  placeholder="What triggers this process? e.g. manual navigation, cron job, webhook..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Database className="h-4 w-4" />
              Create Process
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
