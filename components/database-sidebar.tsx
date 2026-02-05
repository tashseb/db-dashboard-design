"use client"

import { Database, Filter, Search } from "lucide-react"
import type { DatabaseInfo } from "@/lib/data"

interface DatabaseSidebarProps {
  databases: DatabaseInfo[]
  selectedDatabase: string
  onSelectDatabase: (name: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DatabaseSidebar({
  databases,
  selectedDatabase,
  onSelectDatabase,
  searchQuery,
  onSearchChange,
}: DatabaseSidebarProps) {
  const filtered = databases.filter((db) =>
    db.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="flex w-[280px] min-w-[280px] flex-col border-r border-border bg-muted/30">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Databases
        </h2>
        <button type="button" className="text-muted-foreground hover:text-foreground">
          <Filter className="h-4 w-4" />
        </button>
      </div>
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search databases..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((db) => {
          const isSelected = selectedDatabase === db.name
          return (
            <button
              key={db.name}
              type="button"
              onClick={() => onSelectDatabase(db.name)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Database className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
              <div className="min-w-0">
                <div className={`truncate text-sm font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                  {db.name}
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${isSelected ? "bg-green-300" : "bg-green-500"}`} />
                  {db.region}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
