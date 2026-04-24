"use client"

import { useState, useCallback } from "react"
import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Info,
  Play,
  Pause,
  RefreshCw,
  Search,
  Server,
  Terminal,
  User,
  X,
} from "lucide-react"
import { cronJobs as initialCronJobs, projectLogs as initialLogs, type CronJob, type ProjectLog } from "@/lib/data"

export function OperationsDetail() {
  const [activeSection, setActiveSection] = useState<"cron" | "logs">("cron")
  const [cronJobs, setCronJobs] = useState<CronJob[]>(initialCronJobs)
  const [logs] = useState<ProjectLog[]>(initialLogs)
  const [selectedJob, setSelectedJob] = useState<CronJob | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warn" | "error" | "debug">("all")

  const filteredJobs = cronJobs.filter((job) =>
    job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLogs = logs.filter((log) =>
    logFilter === "all" ? true : log.level === logFilter
  )

  const handleToggleJob = useCallback((jobId: string) => {
    setCronJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: job.status === "active" ? "paused" : "active" }
          : job
      )
    )
  }, [])

  const getStatusColor = (status: CronJob["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "paused":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "error":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }
  }

  const getLogLevelColor = (level: ProjectLog["level"]) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "warn":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "error":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "debug":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getLogLevelIcon = (level: ProjectLog["level"]) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4" />
      case "warn":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <X className="h-4 w-4" />
      case "debug":
        return <Terminal className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Operations</h1>
            <p className="text-sm text-muted-foreground">Cron jobs and project logs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection("cron")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeSection === "cron"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Cron Jobs
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("logs")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeSection === "logs"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Terminal className="h-4 w-4" />
            Project Logs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeSection === "cron" ? (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cron jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {cronJobs.filter((j) => j.status === "active").length} Active
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {cronJobs.filter((j) => j.status === "paused").length} Paused
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {cronJobs.filter((j) => j.status === "error").length} Error
                </span>
              </div>
            </div>

            {/* Cron Jobs Table */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Job Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Schedule</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Run</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Next Run</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Success Rate</th>
                    <th className="w-24 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="group cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                      onClick={() => setSelectedJob(job)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{job.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{job.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-2 py-1 text-xs text-foreground">{job.schedule}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{job.lastRun}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{job.nextRun}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status === "active" && <Check className="h-3 w-3" />}
                          {job.status === "paused" && <Pause className="h-3 w-3" />}
                          {job.status === "error" && <X className="h-3 w-3" />}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                job.successRate >= 95 ? "bg-green-500" : job.successRate >= 80 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              style={{ width: `${job.successRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{job.successRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleJob(job.id)
                            }}
                            className={`rounded p-1.5 transition-colors ${
                              job.status === "active"
                                ? "text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                                : "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                            }`}
                            title={job.status === "active" ? "Pause" : "Resume"}
                          >
                            {job.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedJob(job)
                            }}
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="View Details"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Log Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(["all", "info", "warn", "error", "debug"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setLogFilter(level)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      logFilter === level
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {/* Logs List */}
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getLogLevelColor(log.level)}`}>
                      {getLogLevelIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium uppercase ${getLogLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Server className="h-3 w-3" />
                          {log.source}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{log.message}</p>
                      {log.details && (
                        <p className="mt-1 text-xs text-muted-foreground">{log.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Dialog */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedJob(null)}
          />
          <div className="relative z-10 mx-4 w-full max-w-2xl rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedJob.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Status</div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status === "active" && <Check className="h-3.5 w-3.5" />}
                    {selectedJob.status === "paused" && <Pause className="h-3.5 w-3.5" />}
                    {selectedJob.status === "error" && <X className="h-3.5 w-3.5" />}
                    {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                  </span>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Schedule</div>
                  <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{selectedJob.schedule}</code>
                </div>
              </div>

              {/* Timing Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    <Clock className="h-3.5 w-3.5" />
                    Last Run
                  </div>
                  <div className="text-sm text-foreground">{selectedJob.lastRun}</div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Next Run
                  </div>
                  <div className="text-sm text-foreground">{selectedJob.nextRun}</div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    <Clock className="h-3.5 w-3.5" />
                    Duration
                  </div>
                  <div className="text-sm text-foreground">{selectedJob.duration}</div>
                </div>
              </div>

              {/* Command */}
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Command</div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <code className="text-sm font-mono text-foreground break-all">{selectedJob.command}</code>
                </div>
              </div>

              {/* Server and Owner */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Server</div>
                    <div className="text-sm text-foreground">{selectedJob.server}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Owner</div>
                    <div className="text-sm text-foreground">{selectedJob.owner}</div>
                  </div>
                </div>
              </div>

              {/* Success Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Success Rate</div>
                  <span className={`text-sm font-medium ${
                    selectedJob.successRate >= 95 ? "text-green-600" : selectedJob.successRate >= 80 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {selectedJob.successRate}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedJob.successRate >= 95 ? "bg-green-500" : selectedJob.successRate >= 80 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${selectedJob.successRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleJob(selectedJob.id)
                  setSelectedJob(null)
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedJob.status === "active"
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {selectedJob.status === "active" ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause Job
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Resume Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
