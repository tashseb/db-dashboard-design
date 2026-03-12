"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Database, Search, Server, Link2, Info, X, Plus, Table2 } from "lucide-react"
import type { AvailableTable, DatabaseReference } from "@/lib/data"
import { availableTables } from "@/lib/data"

interface TableAutocompleteProps {
  existingTables: DatabaseReference[]
  onAddTable: (table: DatabaseReference) => void
}

export function TableAutocomplete({ existingTables, onAddTable }: TableAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter tables based on query and exclude already added ones
  const filteredTables = availableTables.filter((table) => {
    const isAlreadyAdded = existingTables.some(
      (t) => t.database === table.database && t.table === table.name
    )
    if (isAlreadyAdded) return false
    if (!query) return true
    const searchStr = `${table.name} ${table.database} ${table.server} ${table.details}`.toLowerCase()
    return searchStr.includes(query.toLowerCase())
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0)
  }, [query])

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleSelect = useCallback(
    (table: AvailableTable) => {
      const newRef: DatabaseReference = {
        database: table.database,
        table: table.name,
        usage: "",
        server: table.server,
        details: table.details,
        connection: table.connection,
      }
      onAddTable(newRef)
      setQuery("")
      setIsOpen(false)
      inputRef.current?.focus()
    },
    [onAddTable]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredTables.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (filteredTables[highlightedIndex]) {
          handleSelect(filteredTables[highlightedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={containerRef} className="relative mb-4">
      <label className="mb-2 block text-sm font-medium text-foreground">
        Add Table
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tables by name, database, or server..."
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-background shadow-lg">
          {filteredTables.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Table2 className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {query ? "No tables match your search" : "All available tables have been added"}
              </p>
            </div>
          ) : (
            <ul
              ref={listRef}
              className="max-h-[320px] overflow-y-auto py-1"
              role="listbox"
            >
              {filteredTables.map((table, index) => (
                <li
                  key={table.id}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => handleSelect(table)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`cursor-pointer px-3 py-3 transition-colors ${
                    index === highlightedIndex
                      ? "bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Table2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {table.name}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {table.database}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {table.details}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Server className="h-3 w-3" />
                          <span className="truncate max-w-[180px]">{table.server}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          <span>{table.connection.split("|")[0].trim()}</span>
                        </span>
                      </div>
                    </div>
                    <Plus className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
