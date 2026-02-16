"use client"

import { useState, useMemo, useCallback } from "react"
import { TopNav } from "@/components/top-nav"
import { DatabaseSidebar } from "@/components/database-sidebar"
import { SchemaPanel } from "@/components/schema-panel"
import { TableDetail } from "@/components/table-detail"
import { StoredProcedureDetail } from "@/components/stored-procedure-detail"
import { databases } from "@/lib/data"

export default function Page() {
  const [activeTab, setActiveTab] = useState("table")
  const [selectedDatabase, setSelectedDatabase] = useState(databases[0].name)
  const [selectedTable, setSelectedTable] = useState("users")
  const [selectedProcedure, setSelectedProcedure] = useState("get_user_by_email")
  const [selectedSchema, setSelectedSchema] = useState("public")
  const [searchQuery, setSearchQuery] = useState("")

  const currentDatabase = useMemo(
    () => databases.find((db) => db.name === selectedDatabase),
    [selectedDatabase],
  )

  const currentTable = useMemo(() => {
    if (!currentDatabase) return null
    const schema = currentDatabase.schemas.find(
      (s) => s.name === selectedSchema,
    )
    return schema?.tables.find((t) => t.name === selectedTable) ?? null
  }, [currentDatabase, selectedSchema, selectedTable])

  const currentProcedure = useMemo(() => {
    if (!currentDatabase) return null
    const schema = currentDatabase.schemas.find(
      (s) => s.name === selectedSchema,
    )
    return (
      schema?.storedProcedures.find((sp) => sp.name === selectedProcedure) ??
      null
    )
  }, [currentDatabase, selectedSchema, selectedProcedure])

  const handleSelectDatabase = useCallback(
    (name: string) => {
      setSelectedDatabase(name)
      const db = databases.find((d) => d.name === name)
      if (db && db.schemas.length > 0) {
        const schema = db.schemas[0]
        setSelectedSchema(schema.name)
        if (schema.tables.length > 0) {
          setSelectedTable(schema.tables[0].name)
        }
        if (schema.storedProcedures.length > 0) {
          setSelectedProcedure(schema.storedProcedures[0].name)
        }
      }
    },
    [],
  )

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab)
      if (!currentDatabase) return
      const schema = currentDatabase.schemas.find(
        (s) => s.name === selectedSchema,
      )
      if (!schema) return
      if (tab === "stored-procedures" && schema.storedProcedures.length > 0) {
        setSelectedProcedure(schema.storedProcedures[0].name)
      } else if (tab === "table" && schema.tables.length > 0) {
        setSelectedTable(schema.tables[0].name)
      }
    },
    [currentDatabase, selectedSchema],
  )

  const handleSelectItem = useCallback(
    (schemaName: string, itemName: string) => {
      setSelectedSchema(schemaName)
      if (activeTab === "stored-procedures") {
        setSelectedProcedure(itemName)
      } else {
        setSelectedTable(itemName)
      }
    },
    [activeTab],
  )

  const selectedItem =
    activeTab === "stored-procedures" ? selectedProcedure : selectedTable

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex flex-1 overflow-hidden">
        <DatabaseSidebar
          databases={databases}
          selectedDatabase={selectedDatabase}
          onSelectDatabase={handleSelectDatabase}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {currentDatabase && (
          <SchemaPanel
            schemas={currentDatabase.schemas}
            selectedItem={selectedItem}
            activeTab={activeTab}
            onSelectItem={handleSelectItem}
          />
        )}
        {activeTab === "table" && currentTable && currentDatabase && (
          <TableDetail
            table={currentTable}
            databaseName={currentDatabase.name}
          />
        )}
        {activeTab === "stored-procedures" &&
          currentProcedure &&
          currentDatabase && (
            <StoredProcedureDetail
              procedure={currentProcedure}
              databaseName={currentDatabase.name}
            />
          )}
      </div>
    </div>
  )
}
