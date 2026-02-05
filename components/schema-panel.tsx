"use client"

import { ChevronDown, ChevronRight, Folder, Table2 } from "lucide-react"
import { useState } from "react"
import type { SchemaInfo } from "@/lib/data"

interface SchemaPanelProps {
  schemas: SchemaInfo[]
  selectedTable: string
  onSelectTable: (schemaName: string, tableName: string) => void
}

export function SchemaPanel({ schemas, selectedTable, onSelectTable }: SchemaPanelProps) {
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(
    new Set(schemas.map((s) => s.name))
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

  return (
    <div className="flex w-[240px] min-w-[240px] flex-col border-r border-border bg-background">
      <div className="px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Schemas & Tables
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {schemas.map((schema) => {
          const isExpanded = expandedSchemas.has(schema.name)
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
                  {schema.tables.length}
                </span>
              </button>
              {isExpanded && (
                <div className="ml-4">
                  {schema.tables.map((table) => {
                    const isSelected = selectedTable === table.name
                    return (
                      <button
                        key={table.name}
                        type="button"
                        onClick={() => onSelectTable(schema.name, table.name)}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <Table2 className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="truncate">{table.name}</span>
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
