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

export interface IssueRecord {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved"
  reportedDate: string
  resolvedDate?: string
  solution?: string
}

export interface DatabaseReference {
  database: string
  table: string
  usage: string
}

export interface ProcessInfo {
  name: string
  pagePath: string
  description: string
  mainFunctionality: string
  dataPopulation: string
  databasesUsed: DatabaseReference[]
  mainUsers: string[]
  issues: IssueRecord[]
}

export interface SchemaInfo {
  name: string
  tables: TableInfo[]
  storedProcedures: StoredProcedureInfo[]
  processes: ProcessInfo[]
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
        processes: [
          {
            name: "User Management Dashboard",
            pagePath: "/admin/users",
            description: "Administrative dashboard for viewing, searching, and managing user accounts across the platform. Provides bulk operations and individual user editing.",
            mainFunctionality: "Displays a paginated table of all users with search, filter, and sort capabilities. Admins can activate/deactivate accounts, reset passwords, edit user profiles, and export user data. Includes real-time user count metrics and activity graphs.",
            dataPopulation: "Initial page load fetches the first 50 users via the get_user_by_email stored procedure with pagination parameters. Search triggers a debounced API call to /api/users/search which queries the users table with ILIKE filters. User metrics are aggregated via a materialized view refreshed every 15 minutes.",
            databasesUsed: [
              { database: "Production_Main", table: "users", usage: "Primary read/write for all user CRUD operations" },
              { database: "Production_Main", table: "orders", usage: "Read-only join to display order count per user" },
            ],
            mainUsers: ["System Administrators", "Support Team Leads", "Compliance Officers"],
            issues: [
              {
                id: "ISS-001",
                title: "Slow page load with large user base",
                description: "Page takes over 8 seconds to load when user count exceeds 100K records. The initial query lacks proper pagination and loads all users into memory.",
                severity: "high",
                status: "resolved",
                reportedDate: "September 12, 2023",
                resolvedDate: "September 18, 2023",
                solution: "Added cursor-based pagination to the users query, implemented server-side filtering, and added a composite index on (is_active, created_at) to the users table.",
              },
              {
                id: "ISS-002",
                title: "Search returns stale results after deactivation",
                description: "After deactivating a user, the search results still show the user as active until a hard refresh. The client-side cache is not invalidated after mutation.",
                severity: "medium",
                status: "resolved",
                reportedDate: "October 3, 2023",
                resolvedDate: "October 5, 2023",
                solution: "Implemented optimistic UI updates with SWR mutation and added cache revalidation after all user status change operations.",
              },
              {
                id: "ISS-003",
                title: "Bulk export times out for full dataset",
                description: "Exporting all users to CSV triggers a 504 gateway timeout when the dataset exceeds 80K rows. The export runs synchronously in a single API route.",
                severity: "medium",
                status: "investigating",
                reportedDate: "October 20, 2023",
              },
            ],
          },
          {
            name: "Order History Page",
            pagePath: "/account/orders",
            description: "Customer-facing page that displays a user's complete order history with status tracking, filtering by date range, and order detail drill-down.",
            mainFunctionality: "Shows a chronological list of orders for the authenticated user. Each order row displays the order ID, total amount, status badge, and creation date. Users can click into an order to see line items, shipping info, and payment details. Includes date range filtering and status filtering.",
            dataPopulation: "On page load, the authenticated user's ID is extracted from the session token. Orders are fetched via /api/orders?user_id={id} which runs a SELECT on the orders table with user_id filter, ordered by created_at DESC. Order details are lazy-loaded on expand via a separate API call joining orders with order_items.",
            databasesUsed: [
              { database: "Production_Main", table: "orders", usage: "Primary read for order listing and filtering" },
              { database: "Production_Main", table: "users", usage: "Read to validate user session and display user info in header" },
            ],
            mainUsers: ["Registered Customers", "Customer Support Agents"],
            issues: [
              {
                id: "ISS-004",
                title: "Orders not visible after status change",
                description: "When an order status is updated by the fulfillment system, the customer's order history page still shows the old status due to aggressive caching with a 5-minute TTL.",
                severity: "high",
                status: "resolved",
                reportedDate: "October 8, 2023",
                resolvedDate: "October 10, 2023",
                solution: "Reduced cache TTL to 30 seconds for order status fields and added a webhook listener from the fulfillment service to trigger cache invalidation on status changes.",
              },
              {
                id: "ISS-005",
                title: "Date filter timezone mismatch",
                description: "Users in non-UTC timezones see incorrect orders when filtering by date. The frontend sends local dates but the backend compares against UTC timestamps.",
                severity: "low",
                status: "open",
                reportedDate: "October 15, 2023",
              },
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
        processes: [
          {
            name: "Staging Test Runner",
            pagePath: "/staging/test-runner",
            description: "Internal tool used by QA engineers to execute automated test suites against the staging database and verify data integrity after resets.",
            mainFunctionality: "Provides a UI to trigger the reset_staging_data procedure, run predefined test suites, and view pass/fail results in real time. Includes a log viewer for detailed test output and a history panel showing previous test runs.",
            dataPopulation: "Test configuration is loaded from a static JSON config on page mount. After a reset is triggered via the reset_staging_data procedure, test results are streamed via Server-Sent Events from /api/staging/test-stream. Historical runs are fetched from a test_runs table on initial load.",
            databasesUsed: [
              { database: "Staging_Replica", table: "users", usage: "Read/write target for data integrity tests after reset" },
            ],
            mainUsers: ["QA Engineers", "DevOps Team"],
            issues: [
              {
                id: "ISS-006",
                title: "SSE connection drops after 60 seconds",
                description: "The Server-Sent Events stream for test results disconnects after exactly 60 seconds due to a proxy timeout, causing long-running test suites to appear stuck.",
                severity: "high",
                status: "resolved",
                reportedDate: "October 14, 2023",
                resolvedDate: "October 16, 2023",
                solution: "Configured the reverse proxy to allow 5-minute SSE connections and added client-side auto-reconnect with exponential backoff and last-event-id tracking.",
              },
            ],
          },
        ],
      },
    ],
  },
]
