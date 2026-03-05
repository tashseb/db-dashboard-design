"use client"

import { Calendar, Database, Hash, KeyRound, RotateCcw, Save } from "lucide-react"
import type { TableInfo } from "@/lib/data"

interface TableDetailProps {
  table: TableInfo
  databaseName: string
}

export function TableDetail({ table, databaseName }: TableDetailProps) {
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
    </div>
  )
}
