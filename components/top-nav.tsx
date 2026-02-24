"use client"

import {
  Database,
  FileText,
  FolderCog as FolderCode,
  PanelLeft,
  PanelLeftClose,
  Columns2,
  Columns3,
  Workflow,
} from "lucide-react"

const tabs = [
  { label: "Table", icon: Database, id: "table" },
  { label: "Stored Procedures", icon: FolderCode, id: "stored-procedures" },
  { label: "Process", icon: Workflow, id: "process" },
  { label: "Documents", icon: FileText, id: "documents" },
] as const

interface TopNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
  schemaOpen: boolean
  onToggleSchema: () => void
}

export function TopNav({
  activeTab,
  onTabChange,
  sidebarOpen,
  onToggleSidebar,
  schemaOpen,
  onToggleSchema,
}: TopNavProps) {
  return (
    <header className="flex shrink-0 flex-col border-b border-border bg-background sm:h-14 sm:flex-row sm:items-center">
      <div className="flex h-14 items-center justify-between px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Database className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">DataScout</span>
        </div>
        <div className="flex items-center gap-1 sm:hidden">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={sidebarOpen ? "Close database sidebar" : "Open database sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onToggleSchema}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={schemaOpen ? "Close schema panel" : "Open schema panel"}
          >
            {schemaOpen ? (
              <Columns3 className="h-4 w-4" />
            ) : (
              <Columns2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between overflow-x-auto border-t border-border sm:h-full sm:flex-1 sm:border-t-0">
        <nav className="flex h-full items-end gap-1 px-3 sm:px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-t-md px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="hidden items-center gap-1 pr-3 sm:flex">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={sidebarOpen ? "Close database sidebar" : "Open database sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onToggleSchema}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={schemaOpen ? "Close schema panel" : "Open schema panel"}
          >
            {schemaOpen ? (
              <Columns3 className="h-4 w-4" />
            ) : (
              <Columns2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="hidden pr-5 sm:block">
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    </header>
  )
}
