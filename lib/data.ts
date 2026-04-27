export interface Column {
  name: string
  dataType: string
  nullable: boolean
  isPrimaryKey: boolean
}

// User Access types
export interface PageAccess {
  id: string
  name: string
  path: string
  category: string
}

export interface SystemUser {
  id: string
  name: string
  email: string
  role: string
  team: string
  accessLevel: string
  pages: string[]
}

export interface AccessRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  requestType: "single" | "multiple" | "clone"
  pages: string[]
  cloneUserId?: string
  cloneUserName?: string
  status: "pending" | "approved" | "declined"
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

// Mock pages for access
export const availablePages: PageAccess[] = [
  { id: "page-1", name: "User Management Dashboard", path: "/admin/users", category: "Admin" },
  { id: "page-2", name: "Order History Page", path: "/orders/history", category: "Customer" },
  { id: "page-3", name: "Analytics Dashboard", path: "/analytics", category: "Analytics" },
  { id: "page-4", name: "Payment Settings", path: "/settings/payments", category: "Settings" },
  { id: "page-5", name: "Database Explorer", path: "/admin/database", category: "Admin" },
  { id: "page-6", name: "Report Generator", path: "/reports/generate", category: "Reports" },
  { id: "page-7", name: "Audit Logs", path: "/admin/audit", category: "Admin" },
  { id: "page-8", name: "API Keys Management", path: "/settings/api-keys", category: "Settings" },
  { id: "page-9", name: "Billing Dashboard", path: "/billing", category: "Finance" },
  { id: "page-10", name: "Team Management", path: "/admin/teams", category: "Admin" },
]

// Mock system users
export const systemUsers: SystemUser[] = [
  { id: "user-1", name: "Sarah Chen", email: "sarah.chen@company.com", role: "Platform Lead", team: "Platform Team", accessLevel: "Admin", pages: ["page-1", "page-2", "page-3", "page-4", "page-5", "page-6", "page-7", "page-8", "page-9", "page-10"] },
  { id: "user-2", name: "Mike Torres", email: "mike.torres@company.com", role: "Senior DBA", team: "Database Team", accessLevel: "Developer", pages: ["page-5", "page-6", "page-7"] },
  { id: "user-3", name: "Lisa Wang", email: "lisa.wang@company.com", role: "Security Engineer", team: "Security Team", accessLevel: "Security", pages: ["page-7", "page-8"] },
  { id: "user-4", name: "James Park", email: "james.park@company.com", role: "DevOps Lead", team: "Infrastructure Team", accessLevel: "Developer", pages: ["page-3", "page-5", "page-6"] },
  { id: "user-5", name: "Alex Rivera", email: "alex.rivera@company.com", role: "Backend Engineer", team: "Commerce Team", accessLevel: "Developer", pages: ["page-2", "page-3"] },
  { id: "user-6", name: "Emily Johnson", email: "emily.johnson@company.com", role: "Product Manager", team: "Product Team", accessLevel: "Viewer", pages: ["page-3", "page-6"] },
]

// Mock access requests
export const accessRequests: AccessRequest[] = [
  { id: "req-1", requesterId: "user-5", requesterName: "Alex Rivera", requesterEmail: "alex.rivera@company.com", requestType: "single", pages: ["page-5"], status: "pending", requestedAt: "October 26, 2023 at 10:30 AM", notes: "Need access to Database Explorer for debugging production issues" },
  { id: "req-2", requesterId: "user-6", requesterName: "Emily Johnson", requesterEmail: "emily.johnson@company.com", requestType: "multiple", pages: ["page-1", "page-9"], status: "pending", requestedAt: "October 26, 2023 at 9:15 AM", notes: "Require access to User Management and Billing for quarterly review" },
  { id: "req-3", requesterId: "user-5", requesterName: "Alex Rivera", requesterEmail: "alex.rivera@company.com", requestType: "clone", pages: ["page-5", "page-6", "page-7"], cloneUserId: "user-2", cloneUserName: "Mike Torres", status: "pending", requestedAt: "October 25, 2023 at 4:45 PM", notes: "Requesting same access as Mike Torres for database work" },
  { id: "req-4", requesterId: "user-4", requesterName: "James Park", requesterEmail: "james.park@company.com", requestType: "single", pages: ["page-8"], status: "approved", requestedAt: "October 24, 2023 at 2:00 PM", reviewedAt: "October 24, 2023 at 3:30 PM", reviewedBy: "Sarah Chen" },
  { id: "req-5", requesterId: "user-6", requesterName: "Emily Johnson", requesterEmail: "emily.johnson@company.com", requestType: "single", pages: ["page-7"], status: "declined", requestedAt: "October 23, 2023 at 11:00 AM", reviewedAt: "October 23, 2023 at 2:15 PM", reviewedBy: "Lisa Wang", notes: "Audit logs access requires security clearance" },
]

// Cron job types
export interface CronJob {
  id: string
  name: string
  schedule: string
  description: string
  status: "active" | "paused" | "error"
  lastRun: string
  nextRun: string
  duration: string
  command: string
  server: string
  owner: string
  successRate: number
}

export interface ProjectLog {
  id: string
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  source: string
  message: string
  details?: string
}

// Mock cron jobs
export const cronJobs: CronJob[] = [
  { id: "cron-1", name: "Database Backup", schedule: "0 2 * * *", description: "Full database backup to S3 with encryption", status: "active", lastRun: "Today at 2:00 AM", nextRun: "Tomorrow at 2:00 AM", duration: "12m 34s", command: "/scripts/backup-db.sh --full --encrypt", server: "prod-db-01", owner: "Mike Torres", successRate: 99.8 },
  { id: "cron-2", name: "Analytics ETL", schedule: "0 */4 * * *", description: "Extract, transform, and load data to analytics warehouse", status: "active", lastRun: "Today at 8:00 AM", nextRun: "Today at 12:00 PM", duration: "45m 12s", command: "python /etl/analytics_pipeline.py", server: "etl-worker-01", owner: "James Park", successRate: 97.5 },
  { id: "cron-3", name: "Cache Warm-up", schedule: "*/15 * * * *", description: "Pre-warm Redis cache with frequently accessed data", status: "active", lastRun: "10 minutes ago", nextRun: "In 5 minutes", duration: "2m 15s", command: "/scripts/warm-cache.sh", server: "cache-01", owner: "Alex Rivera", successRate: 100 },
  { id: "cron-4", name: "Log Rotation", schedule: "0 0 * * 0", description: "Rotate and archive application logs weekly", status: "active", lastRun: "Last Sunday at 12:00 AM", nextRun: "Sunday at 12:00 AM", duration: "5m 22s", command: "logrotate /etc/logrotate.d/app", server: "all-servers", owner: "Lisa Wang", successRate: 100 },
  { id: "cron-5", name: "Stale Session Cleanup", schedule: "0 3 * * *", description: "Remove expired user sessions from database", status: "paused", lastRun: "3 days ago", nextRun: "Paused", duration: "1m 45s", command: "node /scripts/cleanup-sessions.js", server: "app-01", owner: "Sarah Chen", successRate: 98.2 },
  { id: "cron-6", name: "Health Check Monitor", schedule: "*/5 * * * *", description: "Check all service endpoints and report status", status: "active", lastRun: "2 minutes ago", nextRun: "In 3 minutes", duration: "30s", command: "/scripts/health-check.sh --all", server: "monitor-01", owner: "James Park", successRate: 99.9 },
  { id: "cron-7", name: "Report Generation", schedule: "0 6 * * 1", description: "Generate weekly performance and usage reports", status: "error", lastRun: "Last Monday at 6:00 AM (Failed)", nextRun: "Monday at 6:00 AM", duration: "N/A", command: "python /reports/weekly_report.py", server: "report-worker", owner: "Lisa Wang", successRate: 85.0 },
  { id: "cron-8", name: "SSL Cert Check", schedule: "0 9 * * *", description: "Monitor SSL certificate expiration dates", status: "active", lastRun: "Today at 9:00 AM", nextRun: "Tomorrow at 9:00 AM", duration: "45s", command: "/scripts/check-ssl.sh --notify", server: "monitor-01", owner: "Mike Torres", successRate: 100 },
]

// Mock project logs
export const projectLogs: ProjectLog[] = [
  { id: "log-1", timestamp: "2023-10-26 11:45:32", level: "info", source: "api-gateway", message: "Successfully processed 1,234 requests in the last hour", details: "Average response time: 45ms, Error rate: 0.02%" },
  { id: "log-2", timestamp: "2023-10-26 11:42:15", level: "warn", source: "database", message: "High connection pool usage detected (85%)", details: "Current connections: 85/100. Consider scaling or optimizing queries." },
  { id: "log-3", timestamp: "2023-10-26 11:38:44", level: "error", source: "payment-service", message: "Stripe webhook verification failed", details: "Signature mismatch for event evt_1234. Retrying in 30 seconds." },
  { id: "log-4", timestamp: "2023-10-26 11:35:21", level: "info", source: "deployment", message: "Production deployment completed successfully", details: "Version v2.4.1 deployed to 4 instances. Rolling restart completed." },
  { id: "log-5", timestamp: "2023-10-26 11:30:00", level: "debug", source: "cache", message: "Cache hit ratio: 94.5% over last 15 minutes", details: "Redis memory usage: 2.1GB / 4GB" },
  { id: "log-6", timestamp: "2023-10-26 11:25:18", level: "info", source: "auth-service", message: "JWT token rotation completed", details: "Old tokens will be valid for 24 more hours." },
  { id: "log-7", timestamp: "2023-10-26 11:20:05", level: "warn", source: "storage", message: "S3 bucket approaching storage limit (78%)", details: "Current usage: 780GB / 1TB. Archive old files recommended." },
  { id: "log-8", timestamp: "2023-10-26 11:15:33", level: "error", source: "email-service", message: "SMTP connection timeout to mail server", details: "Failed to connect to smtp.company.com:587. Queuing 23 emails." },
  { id: "log-9", timestamp: "2023-10-26 11:10:12", level: "info", source: "scheduler", message: "Cron job 'Database Backup' completed successfully", details: "Backup size: 4.2GB, Duration: 12m 34s" },
  { id: "log-10", timestamp: "2023-10-26 11:05:00", level: "debug", source: "monitoring", message: "System health check passed all endpoints", details: "All 12 services responding within SLA thresholds." },
]

// Vault credential types
export interface DatabaseCredential {
  id: string
  name: string
  host: string
  port: string
  database: string
  username: string
  password: string
  type: "PostgreSQL" | "MySQL" | "SQL Server" | "Oracle" | "MongoDB"
  environment: "Production" | "Staging" | "Development"
}

export interface ServerCredential {
  id: string
  name: string
  host: string
  port: string
  username: string
  password: string
  type: "SSH" | "FTP" | "SFTP" | "RDP"
  environment: "Production" | "Staging" | "Development"
}

export interface ContactInfo {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  team: string
}

// Mock vault data
export const vaultCredentials = {
  databases: [
    { id: "db-1", name: "Production Main DB", host: "prod-db-01.us-east-1.rds.amazonaws.com", port: "5432", database: "production_main", username: "prod_admin", password: "pr0d_S3cur3_P@ss!", type: "PostgreSQL", environment: "Production" },
    { id: "db-2", name: "Staging Replica", host: "staging-db-01.us-west-2.rds.amazonaws.com", port: "5432", database: "staging_replica", username: "staging_user", password: "st@g1ng_T3st_P@ss", type: "PostgreSQL", environment: "Staging" },
    { id: "db-3", name: "Analytics DW", host: "analytics-dw.us-east-1.redshift.amazonaws.com", port: "5439", database: "analytics_dw", username: "analytics_ro", password: "An@lyt1cs_R3@d0nly!", type: "PostgreSQL", environment: "Production" },
    { id: "db-4", name: "Dev Local", host: "localhost", port: "5432", database: "dev_local", username: "dev_user", password: "d3v_l0c@l_p@ss", type: "PostgreSQL", environment: "Development" },
  ] as DatabaseCredential[],
  servers: [
    { id: "srv-1", name: "Production App Server", host: "prod-app-01.us-east-1.ec2.amazonaws.com", port: "22", username: "deploy_user", password: "D3pl0y_SSH_K3y!", type: "SSH", environment: "Production" },
    { id: "srv-2", name: "Staging App Server", host: "staging-app-01.us-west-2.ec2.amazonaws.com", port: "22", username: "staging_deploy", password: "St@g1ng_SSH!", type: "SSH", environment: "Staging" },
    { id: "srv-3", name: "File Server", host: "files.internal.company.com", port: "22", username: "sftp_user", password: "SFTP_S3cur3_Tr@nsf3r", type: "SFTP", environment: "Production" },
    { id: "srv-4", name: "Windows Jump Box", host: "jumpbox.internal.company.com", port: "3389", username: "admin_user", password: "W1nd0ws_Jump_@cc3ss", type: "RDP", environment: "Production" },
  ] as ServerCredential[],
  contacts: [
    { id: "ct-1", name: "Sarah Chen", role: "Platform Lead", email: "sarah.chen@company.com", phone: "+1 (555) 123-4567", team: "Platform Team" },
    { id: "ct-2", name: "Mike Torres", role: "Senior DBA", email: "mike.torres@company.com", phone: "+1 (555) 234-5678", team: "Database Team" },
    { id: "ct-3", name: "Lisa Wang", role: "Security Engineer", email: "lisa.wang@company.com", phone: "+1 (555) 345-6789", team: "Security Team" },
    { id: "ct-4", name: "James Park", role: "DevOps Lead", email: "james.park@company.com", phone: "+1 (555) 456-7890", team: "Infrastructure Team" },
    { id: "ct-5", name: "Alex Rivera", role: "Backend Engineer", email: "alex.rivera@company.com", team: "Commerce Team" },
  ] as ContactInfo[],
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
