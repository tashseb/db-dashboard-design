"use client"

import { useState, useMemo, useCallback } from "react"
import { TopNav } from "@/components/top-nav"
import { DatabaseSidebar } from "@/components/database-sidebar"
import { SchemaPanel } from "@/components/schema-panel"
import { ProcessSidebar } from "@/components/process-sidebar"
import { TableDetail } from "@/components/table-detail"
import { StoredProcedureDetail } from "@/components/stored-procedure-detail"
import { ProcessDetail } from "@/components/process-detail"
import { EmptyState } from "@/components/empty-state"
import { DocumentsDetail } from "@/components/documents-detail"
import { OperationsDetail } from "@/components/operations-detail"
import { UserAccessDetail } from "@/components/user-access-detail"
import { CreateProcessModal } from "@/components/create-process-modal"
import type { CreateProcessData } from "@/components/create-process-modal"
import { databases as initialDatabases, globalDocuments } from "@/lib/data"
import type { ProcessInfo } from "@/lib/data"

export default function Page() {
  const [activeTab, setActiveTab] = useState("table")
  const [selectedDatabase, setSelectedDatabase] = useState(initialDatabases[0].name)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null)
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [selectedSchema, setSelectedSchema] = useState("public")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [schemaOpen, setSchemaOpen] = useState(true)
  const [processSidebarOpen, setProcessSidebarOpen] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [databases, setDatabases] = useState(initialDatabases)

  const currentDatabase = useMemo(
    () => databases.find((db) => db.name === selectedDatabase),
    [databases, selectedDatabase],
  )

  const currentTable = useMemo(() => {
    if (!currentDatabase || !selectedTable) return null
    const schema = currentDatabase.schemas.find(
      (s) => s.name === selectedSchema,
    )
    return schema?.tables.find((t) => t.name === selectedTable) ?? null
  }, [currentDatabase, selectedSchema, selectedTable])

  const currentProcedure = useMemo(() => {
    if (!currentDatabase || !selectedProcedure) return null
    const schema = currentDatabase.schemas.find(
      (s) => s.name === selectedSchema,
    )
    return (
      schema?.storedProcedures.find((sp) => sp.name === selectedProcedure) ??
      null
    )
  }, [currentDatabase, selectedSchema, selectedProcedure])

  const currentProcess = useMemo(() => {
    if (!currentDatabase || !selectedProcess) return null
    for (const schema of currentDatabase.schemas) {
      const found = schema.processes.find((p) => p.name === selectedProcess)
      if (found) return found
    }
    return null
  }, [currentDatabase, selectedProcess])

  const handleSelectDatabase = useCallback(
    (name: string) => {
      setSelectedDatabase(name)
      setSelectedTable(null)
      setSelectedProcedure(null)
      setSelectedProcess(null)
      const db = databases.find((d) => d.name === name)
      if (db && db.schemas.length > 0) {
        setSelectedSchema(db.schemas[0].name)
      }
    },
    [databases],
  )

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab)
      // Clear selections when switching tabs so empty state shows
      if (tab === "table") {
        setSelectedTable(null)
      } else if (tab === "stored-procedures") {
        setSelectedProcedure(null)
      } else if (tab === "process") {
        setSelectedProcess(null)
      }
    },
    [],
  )

  const handleSelectItem = useCallback(
    (schemaName: string, itemName: string) => {
      setSelectedSchema(schemaName)
      if (activeTab === "stored-procedures") {
        setSelectedProcedure(itemName)
      } else if (activeTab === "process") {
        setSelectedProcess(itemName)
      } else {
        setSelectedTable(itemName)
      }
    },
    [activeTab],
  )

  const handleSelectProcess = useCallback(
    (schemaName: string, processName: string) => {
      setSelectedSchema(schemaName)
      setSelectedProcess(processName)
    },
    [],
  )

  const handleCreateProcess = useCallback(
    (data: CreateProcessData) => {
      const newProcess: ProcessInfo = {
        name: data.name,
        category: data.category,
        description: data.description,
        trigger: data.trigger,
        contact: data.contact,
        lastUpdated: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        updatedBy: "You",
        dataPopulation: data.dataPopulation,
        databasesUsed: data.databasesUsed,
        documents: data.documents,
        issues: [],
      }
      setDatabases((prev) =>
        prev.map((db) =>
          db.name === selectedDatabase
            ? {
                ...db,
                schemas: db.schemas.map((s) =>
                  s.name === selectedSchema
                    ? { ...s, processes: [...s.processes, newProcess] }
                    : s,
                ),
              }
            : db,
        ),
      )
      setSelectedProcess(data.name)
      setCreateModalOpen(false)
    },
    [selectedDatabase, selectedSchema],
  )

  const selectedItem =
    activeTab === "stored-procedures"
      ? selectedProcedure
      : activeTab === "process"
        ? selectedProcess
        : selectedTable

  const isProcessTab = activeTab === "process"
  const isDocumentsTab = activeTab === "documents"
  const isOperationsTab = activeTab === "operations"
  const isUserAccessTab = activeTab === "user-access"

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        sidebarOpen={isProcessTab ? processSidebarOpen : sidebarOpen}
        onToggleSidebar={() =>
          isProcessTab
            ? setProcessSidebarOpen((v) => !v)
            : setSidebarOpen((v) => !v)
        }
        schemaOpen={schemaOpen}
        onToggleSchema={() => setSchemaOpen((v) => !v)}
        hideSchemaToggle={isProcessTab || isDocumentsTab || isOperationsTab || isUserAccessTab}
      />
      <div className="flex flex-1 overflow-hidden">
        {isUserAccessTab ? (
          <UserAccessDetail />
        ) : isOperationsTab ? (
          <OperationsDetail />
        ) : isDocumentsTab ? (
          <DocumentsDetail initialDocuments={globalDocuments} />
        ) : isProcessTab ? (
          <>
            {/* Process tab: single sidebar */}
            {currentDatabase && (
              <ProcessSidebar
                schemas={currentDatabase.schemas}
                selectedProcess={selectedProcess}
                onSelectProcess={handleSelectProcess}
                collapsed={!processSidebarOpen}
                onToggle={() => setProcessSidebarOpen((v) => !v)}
                onCreateProcess={() => setCreateModalOpen(true)}
              />
            )}
            {currentProcess && currentDatabase ? (
              <ProcessDetail
                process={currentProcess}
                databaseName={currentDatabase.name}
                onCreateProcess={() => setCreateModalOpen(true)}
              />
            ) : (
              <EmptyState activeTab="process" />
            )}
          </>
        ) : (
          <>
            {/* Table and Stored Procedures: two-panel sidebar */}
            <DatabaseSidebar
              databases={databases}
              selectedDatabase={selectedDatabase}
              onSelectDatabase={handleSelectDatabase}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              collapsed={!sidebarOpen}
              onToggle={() => setSidebarOpen((v) => !v)}
            />
            {currentDatabase && (
              <SchemaPanel
                schemas={currentDatabase.schemas}
                selectedItem={selectedItem ?? ""}
                activeTab={activeTab}
                onSelectItem={handleSelectItem}
                collapsed={!schemaOpen}
                onToggle={() => setSchemaOpen((v) => !v)}
              />
            )}
            {activeTab === "table" ? (
              currentTable && currentDatabase ? (
                <TableDetail
                  table={currentTable}
                  databaseName={currentDatabase.name}
                />
              ) : (
                <EmptyState activeTab="table" />
              )
            ) : activeTab === "stored-procedures" ? (
              currentProcedure && currentDatabase ? (
                <StoredProcedureDetail
                  procedure={currentProcedure}
                  databaseName={currentDatabase.name}
                />
              ) : (
                <EmptyState activeTab="stored-procedures" />
              )
            ) : null}
          </>
        )}
      </div>
      <CreateProcessModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateProcess}
      />
    </div>
  )
}
