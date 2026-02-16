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

export interface Parameter {
  name: string
  dataType: string
  direction: "IN" | "OUT" | "INOUT"
  defaultValue?: string
}

export interface StoredProcedureInfo {
  name: string
  description: string
  language: string
  lastModified: string
  estimatedDuration: string
  parameters: Parameter[]
  body: string
}

export interface SchemaInfo {
  name: string
  tables: TableInfo[]
  storedProcedures: StoredProcedureInfo[]
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
        storedProcedures: [
          {
            name: "get_user_by_email",
            description: "Retrieves a user record by their email address with optional activity filtering",
            language: "plpgsql",
            lastModified: "October 22, 2023 at 4:15 PM",
            estimatedDuration: "~12ms",
            parameters: [
              { name: "p_email", dataType: "varchar(255)", direction: "IN" },
              { name: "p_active_only", dataType: "boolean", direction: "IN", defaultValue: "true" },
              { name: "p_user_record", dataType: "record", direction: "OUT" },
            ],
            body: `BEGIN
  IF p_active_only THEN
    SELECT * INTO p_user_record
    FROM users
    WHERE email = p_email AND is_active = true;
  ELSE
    SELECT * INTO p_user_record
    FROM users
    WHERE email = p_email;
  END IF;
END;`,
          },
          {
            name: "create_order",
            description: "Creates a new order for a user with validation and returns the generated order ID",
            language: "plpgsql",
            lastModified: "October 24, 2023 at 9:30 AM",
            estimatedDuration: "~25ms",
            parameters: [
              { name: "p_user_id", dataType: "uuid", direction: "IN" },
              { name: "p_total", dataType: "decimal(10,2)", direction: "IN" },
              { name: "p_status", dataType: "varchar(50)", direction: "IN", defaultValue: "'pending'" },
              { name: "p_order_id", dataType: "uuid", direction: "OUT" },
            ],
            body: `DECLARE
  v_user_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM users WHERE id = p_user_id AND is_active = true)
    INTO v_user_exists;

  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'User % not found or inactive', p_user_id;
  END IF;

  INSERT INTO orders (user_id, total, status, created_at)
  VALUES (p_user_id, p_total, p_status, NOW())
  RETURNING id INTO p_order_id;
END;`,
          },
          {
            name: "archive_old_orders",
            description: "Moves orders older than the specified number of days to the archive table",
            language: "plpgsql",
            lastModified: "October 18, 2023 at 2:00 PM",
            estimatedDuration: "~340ms",
            parameters: [
              { name: "p_days_old", dataType: "integer", direction: "IN", defaultValue: "365" },
              { name: "p_archived_count", dataType: "integer", direction: "OUT" },
            ],
            body: `BEGIN
  WITH archived AS (
    DELETE FROM orders
    WHERE created_at < NOW() - (p_days_old || ' days')::interval
    RETURNING *
  )
  INSERT INTO orders_archive SELECT * FROM archived;

  GET DIAGNOSTICS p_archived_count = ROW_COUNT;
END;`,
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
        storedProcedures: [
          {
            name: "reset_staging_data",
            description: "Resets all staging tables to a clean test state by truncating and reseeding",
            language: "plpgsql",
            lastModified: "October 19, 2023 at 11:00 AM",
            estimatedDuration: "~150ms",
            parameters: [
              { name: "p_confirm", dataType: "boolean", direction: "IN" },
              { name: "p_tables_reset", dataType: "integer", direction: "OUT" },
            ],
            body: `BEGIN
  IF NOT p_confirm THEN
    RAISE EXCEPTION 'Reset must be explicitly confirmed';
  END IF;

  TRUNCATE users CASCADE;
  -- Reseed test data
  INSERT INTO users (id, email, username)
  SELECT gen_random_uuid(), 'test' || n || '@example.com', 'testuser' || n
  FROM generate_series(1, 100) AS n;

  p_tables_reset := 1;
END;`,
          },
        ],
      },
    ],
  },
]
