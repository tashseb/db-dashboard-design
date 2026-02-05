export interface Column {
  name: string
  dataType: string
  nullable: boolean
  isPrimaryKey: boolean
}

export interface TableInfo {
  name: string
  estimatedRowCount: number
  description: string
  lastUpdated: string
  columns: Column[]
}

export interface SchemaInfo {
  name: string
  tables: TableInfo[]
}

export interface DatabaseInfo {
  name: string
  region: string
  schemas: SchemaInfo[]
}

export const databases: DatabaseInfo[] = [
  {
    name: "Production_Main",
    region: "US-EAST-1",
    schemas: [
      {
        name: "public",
        tables: [
          {
            name: "users",
            estimatedRowCount: 125430,
            description: "Core user identity and authentication data",
            lastUpdated: "October 25, 2023 at 11:30 PM",
            columns: [
              { name: "id", dataType: "uuid", nullable: false, isPrimaryKey: true },
              { name: "email", dataType: "varchar(255)", nullable: false, isPrimaryKey: false },
              { name: "username", dataType: "varchar(100)", nullable: false, isPrimaryKey: false },
              { name: "password_hash", dataType: "text", nullable: false, isPrimaryKey: false },
              { name: "created_at", dataType: "timestamp", nullable: false, isPrimaryKey: false },
              { name: "updated_at", dataType: "timestamp", nullable: true, isPrimaryKey: false },
              { name: "is_active", dataType: "boolean", nullable: false, isPrimaryKey: false },
            ],
          },
          {
            name: "orders",
            estimatedRowCount: 543210,
            description: "Customer order records and transaction data",
            lastUpdated: "October 26, 2023 at 3:15 AM",
            columns: [
              { name: "id", dataType: "uuid", nullable: false, isPrimaryKey: true },
              { name: "user_id", dataType: "uuid", nullable: false, isPrimaryKey: false },
              { name: "total", dataType: "decimal(10,2)", nullable: false, isPrimaryKey: false },
              { name: "status", dataType: "varchar(50)", nullable: false, isPrimaryKey: false },
              { name: "created_at", dataType: "timestamp", nullable: false, isPrimaryKey: false },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Staging_Replica",
    region: "US-WEST-2",
    schemas: [
      {
        name: "public",
        tables: [
          {
            name: "users",
            estimatedRowCount: 5230,
            description: "Staging copy of user data for testing",
            lastUpdated: "October 20, 2023 at 9:00 AM",
            columns: [
              { name: "id", dataType: "uuid", nullable: false, isPrimaryKey: true },
              { name: "email", dataType: "varchar(255)", nullable: false, isPrimaryKey: false },
              { name: "username", dataType: "varchar(100)", nullable: false, isPrimaryKey: false },
            ],
          },
        ],
      },
    ],
  },
]
