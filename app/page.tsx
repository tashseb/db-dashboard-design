"use client"

import { useState, useMemo } from "react"
import { TopNav } from "@/components/top-nav"
import { DatabaseSidebar } from "@/components/database-sidebar"
import { SchemaPanel } from "@/components/schema-panel"
import { TableDetail } from "@/components/table-detail"
import { databases } from "@/lib/data"

export default function Page() {
  const [activeTab, setActiveTab] = useState("table")
  const [selectedDatabase, setSelectedDatabase] = useState(databases[0].name)
  const [selectedTable, setSelectedTable] = useState("users")
  const [selectedSchema, setSelectedSchema] = useState("public")
  const [searchQuery, setSearchQuery] = useState("")

  const currentDatabase = useMemo(
    () => databases.find((db) => db.name === selectedDatabase),
    [selectedDatabase]
  )

  const currentTable = useMemo(() => {
    if (!currentDatabase) return null
    const schema = currentDatabase.schemas.find((s) => s.name === selectedSchema)
    return schema?.tables.find((t) => t.name === selectedTable) ?? null
  }, [currentDatabase, selectedSchema, selectedTable])

  const handleSelectDatabase = (name: string) => {
    setSelectedDatabase(name)
    const db = databases.find((d) => d.name === name)
    if (db && db.schemas.length > 0) {
      setSelectedSchema(db.schemas[0].name)
      if (db.schemas[0].tables.length > 0) {
        setSelectedTable(db.schemas[0].tables[0].name)
      }
    }
  }

  const handleSelectTable = (schemaName: string, tableName: string) => {
    setSelectedSchema(schemaName)
    setSelectedTable(tableName)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
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
            selectedTable={selectedTable}
            onSelectTable={handleSelectTable}
          />
        )}
        {currentTable && currentDatabase && (
          <TableDetail
            table={currentTable}
            databaseName={currentDatabase.name}
          />
        )}
      </div>
    </div>
  )
}
