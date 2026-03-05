"use client"

import { Database, Workflow, Zap, Table2, MousePointerClick } from "lucide-react"

interface EmptyStateProps {
  activeTab: string
}

const TAB_CONFIG: Record<
  string,
  { icon: React.ElementType; title: string; description: string }
> = {
  table: {
    icon: Table2,
    title: "No Table Selected",
    description:
      "Select a table from the schema panel on the left to view its structure, columns, and details.",
  },
  "stored-procedures": {
    icon: Zap,
    title: "No Procedure Selected",
    description:
      "Select a stored procedure from the schema panel to view its parameters, body, and execution details.",
  },
  process: {
    icon: Workflow,
    title: "No Process Selected",
    description:
      "Select a process from the sidebar or create a new one to document your page workflows, databases used, and issues.",
  },
}

export function EmptyState({ activeTab }: EmptyStateProps) {
  const config = TAB_CONFIG[activeTab] ?? TAB_CONFIG.table
  const Icon = config.icon

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/50">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-balance text-lg font-semibold text-foreground">
          {config.title}
        </h2>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          {config.description}
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/60">
          <MousePointerClick className="h-3.5 w-3.5" />
          <span>Click an item to get started</span>
        </div>
      </div>
    </div>
  )
}
