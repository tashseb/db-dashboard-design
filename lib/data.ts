export interface Column {
  name: string
  dataType: string
  nullable: boolean
  isPrimaryKey: boolean
}

// Table reference types for usage tracking
export interface ProcessReference {
  processName: string
  platform: string
  category: string
  usageType: "read" | "write" | "read/write"
  description: string
  owner: string
}

export interface CodeReference {
  name: string
  type: "procedure" | "function" | "view" | "trigger"
  schema: string
  usageType: "select" | "insert" | "update" | "delete" | "join"
  lastModified: string
}

// Mock table references data
export const tableReferences: Record<string, { processes: ProcessReference[]; codeObjects: CodeReference[] }> = {
  "users": {
    processes: [
      { processName: "User Management Dashboard", platform: "Admin Portal", category: "Admin", usageType: "read/write", description: "CRUD operations for user accounts", owner: "platform-team@company.com" },
      { processName: "Order History Page", platform: "Customer Portal", category: "Customer", usageType: "read", description: "Validates user session and displays user info", owner: "commerce-team@company.com" },
      { processName: "Authentication Service", platform: "API Gateway", category: "Infrastructure", usageType: "read", description: "User lookup during login/token validation", owner: "security-team@company.com" },
      { processName: "Email Campaign Manager", platform: "Marketing Portal", category: "Marketing", usageType: "read", description: "Fetches user emails for campaign targeting", owner: "marketing-team@company.com" },
    ],
    codeObjects: [
      { name: "get_user_by_email", type: "procedure", schema: "public", usageType: "select", lastModified: "October 22, 2023" },
      { name: "create_order", type: "procedure", schema: "public", usageType: "select", lastModified: "October 24, 2023" },
      { name: "vw_active_users", type: "view", schema: "public", usageType: "select", lastModified: "October 15, 2023" },
      { name: "vw_user_order_summary", type: "view", schema: "reporting", usageType: "join", lastModified: "October 18, 2023" },
      { name: "fn_get_user_display_name", type: "function", schema: "public", usageType: "select", lastModified: "October 10, 2023" },
      { name: "trg_user_audit_log", type: "trigger", schema: "public", usageType: "insert", lastModified: "September 28, 2023" },
    ],
  },
  "orders": {
    processes: [
      { processName: "Order History Page", platform: "Customer Portal", category: "Customer", usageType: "read", description: "Displays customer order history with filtering", owner: "commerce-team@company.com" },
      { processName: "User Management Dashboard", platform: "Admin Portal", category: "Admin", usageType: "read", description: "Shows order count per user in admin view", owner: "platform-team@company.com" },
      { processName: "Fulfillment Dashboard", platform: "Operations Portal", category: "Operations", usageType: "read/write", description: "Order processing and status updates", owner: "fulfillment-team@company.com" },
      { processName: "Analytics Pipeline", platform: "Data Platform", category: "Analytics", usageType: "read", description: "ETL job for order analytics aggregation", owner: "data-team@company.com" },
    ],
    codeObjects: [
      { name: "create_order", type: "procedure", schema: "public", usageType: "insert", lastModified: "October 24, 2023" },
      { name: "archive_old_orders", type: "procedure", schema: "public", usageType: "delete", lastModified: "October 18, 2023" },
      { name: "vw_user_order_summary", type: "view", schema: "reporting", usageType: "select", lastModified: "October 18, 2023" },
      { name: "vw_daily_order_totals", type: "view", schema: "reporting", usageType: "select", lastModified: "October 20, 2023" },
      { name: "fn_calculate_order_tax", type: "function", schema: "public", usageType: "select", lastModified: "October 5, 2023" },
    ],
  },
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
  server: string
  details: string
  connection: string
}

// Available tables for autocomplete search
export interface AvailableTable {
  id: string
  name: string
  database: string
  server: string
  details: string
  connection: string
}

export const availableTables: AvailableTable[] = [
  { id: "t1", name: "users", database: "Production_Main", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Core user identity and authentication data", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
  { id: "t2", name: "orders", database: "Production_Main", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Customer order records and transaction data", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
  { id: "t3", name: "products", database: "Production_Main", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Product catalog with inventory and pricing", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
  { id: "t4", name: "sessions", database: "Production_Main", server: "prod-cache-01.us-east-1.elasticache.amazonaws.com", details: "User session tokens and auth state", connection: "Redis 7.0 | TLS | Port 6379" },
  { id: "t5", name: "audit_logs", database: "Production_Main", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "System-wide audit trail for compliance", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
  { id: "t6", name: "users", database: "Staging_Replica", server: "staging-db-01.us-west-2.rds.amazonaws.com", details: "Staging copy of user data for testing", connection: "PostgreSQL 15.2 | SSL Optional | Port 5432" },
  { id: "t7", name: "payments", database: "Production_Main", server: "prod-db-02.us-east-1.rds.amazonaws.com", details: "Payment transactions and billing records", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
  { id: "t8", name: "notifications", database: "Production_Main", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "User notification preferences and history", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
  { id: "t9", name: "analytics_events", database: "Analytics_DW", server: "analytics-dw.us-east-1.redshift.amazonaws.com", details: "Event stream data for analytics processing", connection: "Redshift | SSL Required | Port 5439" },
  { id: "t10", name: "inventory", database: "Production_Main", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Real-time inventory levels and warehousing", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
]

export interface SourceFileInfo {
  name: string
  size: string
  sizeBytes: number
  type: string
}

export interface DocumentFile {
  id: string
  name: string
  size: string
  sizeBytes: number
  type: string
  uploadedAt: string
  uploadedBy: string
  previewUrl?: string
  sourceFile?: SourceFileInfo
}

// Global documents repository
export const globalDocuments: DocumentFile[] = [
  { id: "gdoc-1", name: "User Management - Technical Spec.pdf", size: "2.4 MB", sizeBytes: 2516582, type: "pdf", uploadedAt: "October 10, 2023", uploadedBy: "Sarah Chen", previewUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg", sourceFile: { name: "User Management - Technical Spec.docx", size: "1.8 MB", sizeBytes: 1887436, type: "docx" } },
  { id: "gdoc-2", name: "Admin Dashboard Wireframes.fig", size: "8.1 MB", sizeBytes: 8493465, type: "fig", uploadedAt: "September 28, 2023", uploadedBy: "Alex Rivera" },
  { id: "gdoc-3", name: "User CRUD API Documentation.md", size: "48 KB", sizeBytes: 49152, type: "md", uploadedAt: "October 15, 2023", uploadedBy: "James Park" },
  { id: "gdoc-4", name: "QA Test Plan - Staging.pdf", size: "1.2 MB", sizeBytes: 1258291, type: "pdf", uploadedAt: "October 12, 2023", uploadedBy: "Lisa Wang", previewUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg", sourceFile: { name: "QA Test Plan - Staging.docx", size: "890 KB", sizeBytes: 911360, type: "docx" } },
  { id: "gdoc-5", name: "Database Schema Diagram.png", size: "856 KB", sizeBytes: 876544, type: "png", uploadedAt: "October 5, 2023", uploadedBy: "Mike Torres", previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" },
  { id: "gdoc-6", name: "API Endpoints Reference.docx", size: "124 KB", sizeBytes: 126976, type: "docx", uploadedAt: "October 18, 2023", uploadedBy: "Sarah Chen" },
  { id: "gdoc-7", name: "Performance Benchmarks.xlsx", size: "2.1 MB", sizeBytes: 2202009, type: "xlsx", uploadedAt: "October 20, 2023", uploadedBy: "James Park" },
  { id: "gdoc-8", name: "Architecture Overview.pptx", size: "4.5 MB", sizeBytes: 4718592, type: "pptx", uploadedAt: "September 15, 2023", uploadedBy: "Alex Rivera" },
  { id: "gdoc-9", name: "Security Audit Report.pdf", size: "3.2 MB", sizeBytes: 3355443, type: "pdf", uploadedAt: "October 22, 2023", uploadedBy: "Lisa Wang", previewUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg", sourceFile: { name: "Security Audit Report.pptx", size: "5.1 MB", sizeBytes: 5347737, type: "pptx" } },
  { id: "gdoc-10", name: "Deployment Guide.md", size: "32 KB", sizeBytes: 32768, type: "md", uploadedAt: "October 8, 2023", uploadedBy: "Mike Torres" },
]

export interface ProcessInfo {
  name: string
  category: string
  description: string
  trigger: string
  contact: string
  lastUpdated: string
  updatedBy: string
  dataPopulation: string
  databasesUsed: DatabaseReference[]
  documents: DocumentFile[]
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
            category: "Admin",
            description: "Administrative dashboard for viewing, searching, and managing user accounts across the platform. Provides bulk operations and individual user editing.",
            trigger: "Manual navigation via admin sidebar; auto-redirect after login for admin-role users",
            contact: "platform-team@company.com",
            lastUpdated: "October 25, 2023 at 11:30 PM",
            updatedBy: "Sarah Chen",
            dataPopulation: "Initial page load fetches the first 50 users via the get_user_by_email stored procedure with pagination parameters. Search triggers a debounced API call to /api/users/search which queries the users table with ILIKE filters. User metrics are aggregated via a materialized view refreshed every 15 minutes.",
            databasesUsed: [
              { database: "Production_Main", table: "users", usage: "Primary read/write for all user CRUD operations", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Core user identity and authentication data", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
              { database: "Production_Main", table: "orders", usage: "Read-only join to display order count per user", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Customer order records and transaction data", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
            ],
            documents: [
              { id: "doc-1", name: "User Management - Technical Spec.pdf", size: "2.4 MB", uploadedAt: "October 10, 2023", uploadedBy: "Sarah Chen" },
              { id: "doc-2", name: "Admin Dashboard Wireframes.fig", size: "8.1 MB", uploadedAt: "September 28, 2023", uploadedBy: "Alex Rivera" },
              { id: "doc-3", name: "User CRUD API Documentation.md", size: "48 KB", uploadedAt: "October 15, 2023", uploadedBy: "James Park" },
            ],
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
            category: "Customer",
            description: "Customer-facing page that displays a user's complete order history with status tracking, filtering by date range, and order detail drill-down.",
            trigger: "Navigated from account menu; deep-link from order confirmation email",
            contact: "commerce-team@company.com",
            lastUpdated: "October 26, 2023 at 3:15 AM",
            updatedBy: "Mike Torres",
            dataPopulation: "On page load, the authenticated user's ID is extracted from the session token. Orders are fetched via /api/orders?user_id={id} which runs a SELECT on the orders table with user_id filter, ordered by created_at DESC. Order details are lazy-loaded on expand via a separate API call joining orders with order_items.",
            databasesUsed: [
              { database: "Production_Main", table: "orders", usage: "Primary read for order listing and filtering", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Customer order records and transaction data", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
              { database: "Production_Main", table: "users", usage: "Read to validate user session and display user info in header", server: "prod-db-01.us-east-1.rds.amazonaws.com", details: "Core user identity and authentication data", connection: "PostgreSQL 15.2 | SSL Required | Port 5432" },
            ],
            documents: [],
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
            category: "Internal Tools",
            description: "Internal tool used by QA engineers to execute automated test suites against the staging database and verify data integrity after resets.",
            trigger: "Triggered manually from the QA dashboard or automatically on staging deploy via CI/CD webhook",
            contact: "qa-team@company.com",
            lastUpdated: "October 19, 2023 at 11:00 AM",
            updatedBy: "Lisa Wang",
            dataPopulation: "Test configuration is loaded from a static JSON config on page mount. After a reset is triggered via the reset_staging_data procedure, test results are streamed via Server-Sent Events from /api/staging/test-stream. Historical runs are fetched from a test_runs table on initial load.",
            databasesUsed: [
              { database: "Staging_Replica", table: "users", usage: "Read/write target for data integrity tests after reset", server: "staging-db-01.us-west-2.rds.amazonaws.com", details: "Staging copy of user data for testing", connection: "PostgreSQL 15.2 | SSL Optional | Port 5432" },
            ],
            documents: [
              { id: "doc-4", name: "QA Test Plan - Staging.pdf", size: "1.2 MB", uploadedAt: "October 12, 2023", uploadedBy: "Lisa Wang" },
            ],
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
