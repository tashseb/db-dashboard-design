"use client"

import { useState, useCallback } from "react"
import {
  Check,
  Copy,
  Database,
  FileText,
  FolderCog as FolderCode,
  KeyRound,
  PanelLeft,
  PanelLeftClose,
  Columns2,
  Columns3,
  Server,
  Users,
  Workflow,
  X,
} from "lucide-react"
import { vaultCredentials } from "@/lib/data"

const tabs = [
  { label: "Table", icon: Database, id: "table" },
  { label: "Stored Procedures", icon: FolderCode, id: "stored-procedures" },
  { label: "Process", icon: Workflow, id: "process" },
  { label: "Documents", icon: FileText, id: "documents" },
] as const

const vaultTabs = [
  { label: "Databases", icon: Database, id: "databases" },
  { label: "Servers", icon: Server, id: "servers" },
  { label: "Contacts", icon: Users, id: "contacts" },
] as const

interface TopNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
  schemaOpen: boolean
  onToggleSchema: () => void
  hideSchemaToggle?: boolean
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Failed to copy")
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

function MaskedPassword({ password }: { password: string }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs">
        {revealed ? password : "••••••••••••"}
      </span>
      <button
        type="button"
        onClick={() => setRevealed(!revealed)}
        className="text-xs text-primary hover:underline"
      >
        {revealed ? "Hide" : "Show"}
      </button>
      <CopyButton text={password} />
    </div>
  )
}

export function TopNav({
  activeTab,
  onTabChange,
  sidebarOpen,
  onToggleSidebar,
  schemaOpen,
  onToggleSchema,
  hideSchemaToggle,
}: TopNavProps) {
  const [vaultOpen, setVaultOpen] = useState(false)
  const [activeVaultTab, setActiveVaultTab] = useState<"databases" | "servers" | "contacts">("databases")

  return (
    <>
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
            {!hideSchemaToggle && (
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
            )}
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
          <div className="flex items-center gap-1 pr-3">
            {/* Vault Button */}
            <button
              type="button"
              onClick={() => setVaultOpen(true)}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <KeyRound className="h-4 w-4" />
              <span className="hidden sm:inline">Vault</span>
            </button>
            <div className="hidden items-center gap-1 sm:flex">
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
              {!hideSchemaToggle && (
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
              )}
            </div>
          </div>
        </div>
        <div className="hidden pr-5 sm:block">
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </header>

      {/* Vault Dialog */}
      {vaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setVaultOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setVaultOpen(false)}
          />
          <div className="relative z-10 mx-4 flex max-h-[85vh] w-full max-w-4xl flex-col rounded-xl border border-border bg-background shadow-2xl">
            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Credential Vault</h2>
                  <p className="text-sm text-muted-foreground">
                    Securely stored credentials and contact information
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVaultOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Vault Tabs */}
            <div className="border-b border-border px-6">
              <nav className="flex gap-1">
                {vaultTabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeVaultTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveVaultTab(tab.id as typeof activeVaultTab)}
                      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Vault Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeVaultTab === "databases" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Host</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Database</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Password</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Env</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaultCredentials.databases.map((db) => (
                        <tr key={db.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">{db.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="max-w-[160px] truncate font-mono text-xs text-muted-foreground" title={db.host}>
                                {db.host}:{db.port}
                              </span>
                              <CopyButton text={`${db.host}:${db.port}`} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-muted-foreground">{db.database}</span>
                              <CopyButton text={db.database} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-foreground">{db.username}</span>
                              <CopyButton text={db.username} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <MaskedPassword password={db.password} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              db.environment === "Production"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : db.environment === "Staging"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}>
                              {db.environment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeVaultTab === "servers" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Host</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Password</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Env</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaultCredentials.servers.map((srv) => (
                        <tr key={srv.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">{srv.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="max-w-[180px] truncate font-mono text-xs text-muted-foreground" title={srv.host}>
                                {srv.host}:{srv.port}
                              </span>
                              <CopyButton text={`${srv.host}:${srv.port}`} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {srv.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-foreground">{srv.username}</span>
                              <CopyButton text={srv.username} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <MaskedPassword password={srv.password} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              srv.environment === "Production"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : srv.environment === "Staging"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}>
                              {srv.environment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeVaultTab === "contacts" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[550px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Team</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaultCredentials.contacts.map((contact) => (
                        <tr key={contact.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {contact.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="text-sm font-medium text-foreground">{contact.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{contact.role}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {contact.team}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">
                                {contact.email}
                              </a>
                              <CopyButton text={contact.email} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {contact.phone ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">{contact.phone}</span>
                                <CopyButton text={contact.phone} />
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground/50">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
