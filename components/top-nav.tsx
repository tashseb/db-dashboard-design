"use client"

import { Database, FileText, FolderCog as FolderCode } from "lucide-react"

const tabs = [
  { label: "Table", icon: Database, id: "table" },
  { label: "Stored Procedures", icon: FolderCode, id: "stored-procedures" },
  { label: "Documents", icon: FileText, id: "documents" },
] as const

interface TopNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TopNav({ activeTab, onTabChange }: TopNavProps) {
  return (
    <header className="flex h-14 items-center border-b border-border bg-background">
      <div className="flex items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Database className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">DataScout</span>
      </div>
      <nav className="flex h-full items-end gap-1 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>
      <div className="ml-auto pr-5">
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    </header>
  )
}
