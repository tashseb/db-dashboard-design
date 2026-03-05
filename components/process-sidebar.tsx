"use client"

import { ChevronsRight, Plus, Search, Workflow, X } from "lucide-react"
import { useState } from "react"
import type { SchemaInfo } from "@/lib/data"

interface ProcessSidebarProps {
  schemas: SchemaInfo[]
  selectedProcess: string | null
  onSelectProcess: (schemaName: string, processName: string) => void
  collapsed: boolean
  onToggle: () => void
  onCreateProcess: () => void
}

export function ProcessSidebar({
  schemas,
  selectedProcess,
  onSelectProcess,
  collapsed,
  onToggle,
  onCreateProcess,
}: ProcessSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Flatten all processes across schemas with their schema name
  const allProcesses = schemas.flatMap((schema) =>
    schema.processes.map((p) => ({ ...p, schemaName: schema.name })),
  )

  const filtered = allProcesses.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (collapsed) {
    return (
      <aside className="flex w-11 min-w-11 flex-col items-center border-r border-border bg-muted/30">
        <button
          type="button"
          onClick={onToggle}
          className="group flex w-full flex-col items-center gap-3 px-1 py-4 transition-colors hover:bg-muted"
          aria-label="Expand process sidebar"
        >
          <ChevronsRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
          <span className="writing-vertical text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground">
            Processes
          </span>
        </button>
        <div className="mt-2 flex flex-1 flex-col items-center gap-1.5 px-1">
          {allProcesses.map((p) => {
            const isSelected = selectedProcess === p.name
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => onSelectProcess(p.schemaName, p.name)}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={p.name}
                aria-label={p.name}
              >
                <Workflow className="h-4 w-4" />
              </button>
            )
          })}
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex w-[260px] min-w-[260px] flex-col border-r border-border bg-muted/30 xl:w-[300px] xl:min-w-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Processes
        </h2>
        <button
          type="button"
          onClick={onCreateProcess}
          className="flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search processes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Process list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Workflow className="mb-2 h-6 w-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No processes match your search" : "No processes found"}
            </p>
          </div>
        ) : (
          filtered.map((p) => {
            const isSelected = selectedProcess === p.name
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => onSelectProcess(p.schemaName, p.name)}
                className={`mb-1 flex w-full flex-col gap-1 rounded-lg px-3 py-3 text-left transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Workflow
                    className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`truncate text-sm font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {p.name}
                  </span>
                </div>
                <div
                  className={`ml-[26px] flex items-center gap-2 text-xs ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  <span className="truncate">{p.category}</span>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="truncate">{p.schemaName}</span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}
