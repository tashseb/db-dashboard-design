"use client"

import { useState, useCallback, useRef } from "react"
import {
  AlertCircle,
  Calendar,
  Download,
  Eye,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  HardDrive,
  Search,
  Trash2,
  UploadCloud,
  User,
  X,
} from "lucide-react"
import type { DocumentFile } from "@/lib/data"

// Constants
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "md", "png", "jpg", "jpeg", "gif", "fig"]
const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// File type icon mapping
function getFileIcon(type: string) {
  const lower = type.toLowerCase()
  if (["png", "jpg", "jpeg", "gif"].includes(lower)) return FileImage
  if (["xls", "xlsx"].includes(lower)) return FileSpreadsheet
  if (["pdf"].includes(lower)) return FileText
  if (["doc", "docx", "txt", "md"].includes(lower)) return FileType
  return File
}

// File type color mapping
function getFileColor(type: string) {
  const lower = type.toLowerCase()
  if (["pdf"].includes(lower)) return "text-red-500"
  if (["doc", "docx"].includes(lower)) return "text-blue-500"
  if (["xls", "xlsx"].includes(lower)) return "text-green-500"
  if (["ppt", "pptx"].includes(lower)) return "text-orange-500"
  if (["png", "jpg", "jpeg", "gif"].includes(lower)) return "text-purple-500"
  if (["fig"].includes(lower)) return "text-pink-500"
  if (["md", "txt"].includes(lower)) return "text-muted-foreground"
  return "text-muted-foreground"
}

interface UploadError {
  fileName: string
  reason: string
}

interface DocumentsDetailProps {
  initialDocuments?: DocumentFile[]
}

export function DocumentsDetail({ initialDocuments = [] }: DocumentsDetailProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredDoc, setHoveredDoc] = useState<DocumentFile | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [viewingDoc, setViewingDoc] = useState<DocumentFile | null>(null)
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter documents by search
  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Validate file
  const validateFile = useCallback((file: File): { valid: boolean; reason?: string } => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        reason: `File type ".${ext}" is not allowed. Supported: ${ALLOWED_EXTENSIONS.join(", ")}`,
      }
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        reason: `File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the ${MAX_FILE_SIZE_MB} MB limit`,
      }
    }

    return { valid: true }
  }, [])

  // Format file size
  const formatSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }, [])

  // Handle file upload
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newErrors: UploadError[] = []
    const newDocs: DocumentFile[] = []

    Array.from(files).forEach((file) => {
      const validation = validateFile(file)
      if (!validation.valid) {
        newErrors.push({ fileName: file.name, reason: validation.reason ?? "Unknown error" })
      } else {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
        const isImage = ["png", "jpg", "jpeg", "gif"].includes(ext)
        newDocs.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          size: formatSize(file.size),
          sizeBytes: file.size,
          type: ext,
          uploadedAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          uploadedBy: "You",
          previewUrl: isImage ? URL.createObjectURL(file) : undefined,
        })
      }
    })

    if (newErrors.length > 0) {
      setUploadErrors(newErrors)
    }
    if (newDocs.length > 0) {
      setDocuments((prev) => [...newDocs, ...prev])
    }
  }, [validateFile, formatSize])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  // Handle mouse move for preview positioning
  const handleMouseMove = useCallback((e: React.MouseEvent, doc: DocumentFile) => {
    setHoveredDoc(doc)
    setHoverPosition({ x: e.clientX + 16, y: e.clientY + 16 })
  }, [])

  // Delete document
  const handleDelete = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  // Dismiss error
  const dismissError = useCallback((index: number) => {
    setUploadErrors((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-64"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <UploadCloud className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",")}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Error notifications */}
      {uploadErrors.length > 0 && (
        <div className="border-b border-border bg-destructive/5 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            {uploadErrors.map((err, i) => (
              <div
                key={`${err.fileName}-${i}`}
                className="flex items-start justify-between gap-3 rounded-md border border-destructive/20 bg-background px-3 py-2"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">{err.fileName}</p>
                    <p className="text-xs text-muted-foreground">{err.reason}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dismissError(i)}
                  className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Upload drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-6 rounded-xl border-2 border-dashed transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:border-muted-foreground/30"
          }`}
        >
          <div className="flex flex-col items-center justify-center px-6 py-10">
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                isDragging ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <UploadCloud
                className={`h-7 w-7 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
              />
            </div>
            <p className="mb-1 text-sm font-medium text-foreground">
              {isDragging ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              or click the upload button above
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <HardDrive className="h-3 w-3" />
                Max {MAX_FILE_SIZE_MB} MB
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                PDF, Word, Excel, Images, Figma
              </span>
            </div>
          </div>
        </div>

        {/* Documents list */}
        {filteredDocs.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                    Size
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                    Uploaded
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                    By
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => {
                  const Icon = getFileIcon(doc.type)
                  const iconColor = getFileColor(doc.type)
                  return (
                    <tr
                      key={doc.id}
                      className="group border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                      onMouseMove={(e) => handleMouseMove(e, doc)}
                      onMouseLeave={() => setHoveredDoc(null)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted ${iconColor}`}
                          >
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase sm:hidden">
                              {doc.type} · {doc.size}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3.5 text-sm text-muted-foreground sm:table-cell">
                        {doc.size}
                      </td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {doc.uploadedAt}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3.5 lg:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {doc.uploadedBy}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="rounded-md p-2 text-muted-foreground opacity-0 transition-all hover:bg-primary/10 hover:text-primary group-hover:opacity-100"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-md p-2 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc.id)}
                            className="rounded-md p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <FileText className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No documents yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload your first document to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <Search className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No results found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>

      {/* Hover preview tooltip */}
      {hoveredDoc && (hoveredDoc.previewUrl || ["png", "jpg", "jpeg", "gif"].includes(hoveredDoc.type)) && (
        <div
          className="pointer-events-none fixed z-50 overflow-hidden rounded-lg border border-border bg-background shadow-xl"
          style={{
            left: Math.min(hoverPosition.x, window.innerWidth - 220),
            top: Math.min(hoverPosition.y, window.innerHeight - 160),
          }}
        >
          {hoveredDoc.previewUrl ? (
            <img
              src={hoveredDoc.previewUrl}
              alt={hoveredDoc.name}
              className="h-36 w-52 object-cover"
            />
          ) : (
            <div className="flex h-36 w-52 items-center justify-center bg-muted">
              <FileImage className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="border-t border-border bg-muted/50 px-3 py-2">
            <p className="truncate text-xs font-medium text-foreground">{hoveredDoc.name}</p>
          </div>
        </div>
      )}

      {/* Document viewer modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getFileIcon(viewingDoc.type)
                  const iconColor = getFileColor(viewingDoc.type)
                  return (
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${iconColor}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  )
                })()}
                <div>
                  <h2 className="text-base font-semibold text-foreground">{viewingDoc.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {viewingDoc.size} · Uploaded by {viewingDoc.uploadedBy} on {viewingDoc.uploadedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setViewingDoc(null)}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* Modal content */}
            <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/30 p-8">
              {viewingDoc.previewUrl ? (
                <img
                  src={viewingDoc.previewUrl}
                  alt={viewingDoc.name}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
                />
              ) : ["pdf"].includes(viewingDoc.type) ? (
                <div className="flex flex-col items-center text-center">
                  <FileText className="mb-4 h-20 w-20 text-red-500/60" />
                  <p className="text-sm font-medium text-foreground">PDF Preview</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    In a real app, this would render the PDF using a viewer library
                  </p>
                </div>
              ) : ["doc", "docx"].includes(viewingDoc.type) ? (
                <div className="flex flex-col items-center text-center">
                  <FileType className="mb-4 h-20 w-20 text-blue-500/60" />
                  <p className="text-sm font-medium text-foreground">Word Document</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Download to view this document
                  </p>
                </div>
              ) : ["xls", "xlsx"].includes(viewingDoc.type) ? (
                <div className="flex flex-col items-center text-center">
                  <FileSpreadsheet className="mb-4 h-20 w-20 text-green-500/60" />
                  <p className="text-sm font-medium text-foreground">Excel Spreadsheet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Download to view this spreadsheet
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <File className="mb-4 h-20 w-20 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-foreground">{viewingDoc.type.toUpperCase()} File</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Preview not available - download to view
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
