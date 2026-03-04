"use client"

import { ChevronDown, ChevronRight, ChevronsRight, Folder, Plus, Table2, Zap, Workflow } from "lucide-react"
import { useState } from "react"
import type { SchemaInfo } from "@/lib/data"

interface SchemaPanelProps {
  schemas: SchemaInfo[]
  selectedItem: string
  activeTab: string
  onSelectItem: (schemaName: string, itemName: string) => void
  collapsed: boolean
  onToggle: () => void
  onCreateProcess?: () => void
}

export function SchemaPanel({
  schemas,
  selectedItem,
  activeTab,
  onSelectItem,
  collapsed,
  onToggle,
  onCreateProcess,
}: SchemaPanelProps) {
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(
    new Set(schemas.map((s) => s.name)),
  )

  const toggleSchema = (name: string) => {
    setExpandedSchemas((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const isStoredProcedures = activeTab === "stored-procedures"
  const isProcess = activeTab === "process"
  const panelTitle = isProcess
    ? "Schemas & Processes"
    : isStoredProcedures
      ? "Schemas & Procedures"
      : "Schemas & Tables"

  const ItemIcon = isProcess ? Workflow : isStoredProcedures ? Zap : Table2

  if (collapsed) {
    return (
      <div className="flex w-11 min-w-11 flex-col items-center border-r border-border bg-background">
        <button
          type="button"
          onClick={onToggle}
          className="group flex w-full flex-col items-center gap-3 px-1 py-4 transition-colors hover:bg-muted"
          aria-label="Expand schema panel"
        >
          <ChevronsRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
          <span className="writing-vertical text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground">
            Schemas
          </span>
        </button>
        <div className="mt-2 flex flex-1 flex-col items-center gap-1 px-1">
          {schemas.flatMap((schema) => {
            const items = isProcess
              ? schema.processes
              : isStoredProcedures
                ? schema.storedProcedures
                : schema.tables
            return items.map((item) => {
              const isSelected = selectedItem === item.name
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onSelectItem(schema.name, item.name)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title={item.name}
                  aria-label={item.name}
                >
                  <ItemIcon className="h-4 w-4" />
                </button>
              )
            })
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[200px] min-w-[200px] flex-col border-r border-border bg-background xl:w-[240px] xl:min-w-[240px]">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {panelTitle}
        </h2>
        {isProcess && onCreateProcess && (
          <button
            type="button"
            onClick={onCreateProcess}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Create new process"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {schemas.map((schema) => {
          const isExpanded = expandedSchemas.has(schema.name)
          const items = isProcess
            ? schema.processes
            : isStoredProcedures
              ? schema.storedProcedures
              : schema.tables
          return (
            <div key={schema.name}>
              <button
                type="button"
                onClick={() => toggleSchema(schema.name)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium">{schema.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {items.length}
                </span>
              </button>
              {isExpanded && (
                <div className="ml-4">
                  {items.map((item) => {
                    const isSelected = selectedItem === item.name
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => onSelectItem(schema.name, item.name)}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <ItemIcon className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="truncate">{item.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
