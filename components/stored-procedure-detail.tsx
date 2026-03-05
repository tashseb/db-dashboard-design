"use client"

import {
  Calendar,
  Clock,
  Code2,
  Database,
  Play,
  RotateCcw,
  Save,
} from "lucide-react"
import type { StoredProcedureInfo } from "@/lib/data"

interface StoredProcedureDetailProps {
  procedure: StoredProcedureInfo
  databaseName: string
}

export function StoredProcedureDetail({
  procedure,
  databaseName,
}: StoredProcedureDetailProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="border-b border-border px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4 shrink-0" />
              <span className="truncate">{databaseName}</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="truncate font-medium text-primary">{procedure.name}</span>
            </div>
            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {procedure.name}
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:px-4"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-transparent px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 sm:px-4"
            >
              <Play className="h-4 w-4" />
              Execute
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Procedure Name
            </label>
            <input
              type="text"
              defaultValue={procedure.name}
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Language
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-foreground">
                {procedure.language}
              </span>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Est. Duration
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {procedure.estimatedDuration}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            defaultValue={procedure.description}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Last Modified
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {procedure.lastModified}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Parameters
        </h2>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Data Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Direction
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Default
                </th>
              </tr>
            </thead>
            <tbody>
              {procedure.parameters.map((param) => (
                <tr
                  key={param.name}
                  className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {param.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {param.dataType}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                        param.direction === "OUT"
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : param.direction === "INOUT"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-border bg-muted text-foreground"
                      }`}
                    >
                      {param.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {param.defaultValue ?? "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Procedure Body
        </h2>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {procedure.language}
            </span>
          </div>
          <pre className="overflow-x-auto bg-muted/20 p-4">
            <code className="text-sm font-mono leading-relaxed text-foreground">
              {procedure.body}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
