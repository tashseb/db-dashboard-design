"use client"

import { useState, useCallback } from "react"
import {
  Calendar,
  Clock,
  Code2,
  Database,
  Languages,
  Play,
  RotateCcw,
  Save,
  X,
} from "lucide-react"
import type { StoredProcedureInfo } from "@/lib/data"

interface StoredProcedureDetailProps {
  procedure: StoredProcedureInfo
  databaseName: string
}

// Mock translation function (in real app, this would call a translation API)
function translateToJapanese(text: string): string {
  // Simulated translations for demo
  const translations: Record<string, string> = {
    "Retrieves a user record by their email address with optional activity filtering":
      "オプションのアクティビティフィルタリングを使用して、メールアドレスでユーザーレコードを取得します",
    "Creates a new order for a user with validation and returns the generated order ID":
      "ユーザーの新しい注文をバリデーション付きで作成し、生成された注文IDを返します",
    "Moves orders older than the specified number of days to the archive table":
      "指定された日数より古い注文をアーカイブテーブルに移動します",
    "Resets all staging tables to a clean test state by truncating and reseeding":
      "すべてのステージングテーブルを切り捨てて再シードすることで、クリーンなテスト状態にリセットします",
  }
  return translations[text] || `[日本語翻訳] ${text}`
}

export function StoredProcedureDetail({
  procedure,
  databaseName,
}: StoredProcedureDetailProps) {
  const [description, setDescription] = useState(procedure.description)
  const [translationDialogOpen, setTranslationDialogOpen] = useState(false)
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)

  const handleOpenTranslation = useCallback(() => {
    setIsTranslating(true)
    setTranslationDialogOpen(true)
    // Simulate API delay
    setTimeout(() => {
      setTranslatedText(translateToJapanese(description))
      setIsTranslating(false)
    }, 500)
  }, [description])

  const handleApplyTranslation = useCallback(() => {
    setDescription(translatedText)
    setTranslationDialogOpen(false)
  }, [translatedText])
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="border-b border-border px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4 shrink-0" />
              <span className="truncate">{databaseName}</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="truncate font-medium text-primary">{procedure.name}</span>
            </div>
            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {procedure.name}
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:px-4"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-transparent px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 sm:px-4"
            >
              <Play className="h-4 w-4" />
              Execute
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          General Information
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Procedure Name
            </label>
            <input
              type="text"
              defaultValue={procedure.name}
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Language
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-foreground">
                {procedure.language}
              </span>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Est. Duration
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {procedure.estimatedDuration}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <button
              type="button"
              onClick={handleOpenTranslation}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Languages className="h-3.5 w-3.5" />
              Translate
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Last Modified
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {procedure.lastModified}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Parameters
        </h2>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Data Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Direction
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Default
                </th>
              </tr>
            </thead>
            <tbody>
              {procedure.parameters.map((param) => (
                <tr
                  key={param.name}
                  className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {param.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {param.dataType}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                        param.direction === "OUT"
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : param.direction === "INOUT"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-border bg-muted text-foreground"
                      }`}
                    >
                      {param.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {param.defaultValue ?? "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Procedure Body
        </h2>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {procedure.language}
            </span>
          </div>
          <pre className="overflow-x-auto bg-muted/20 p-4">
            <code className="text-sm font-mono leading-relaxed text-foreground">
              {procedure.body}
            </code>
          </pre>
        </div>
      </div>

      {/* Translation Dialog */}
      {translationDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setTranslationDialogOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setTranslationDialogOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Languages className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Translate Description
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Japanese Translation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTranslationDialogOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="mb-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original Text
                </label>
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
                  {description}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Japanese Translation
                </label>
                {isTranslating ? (
                  <div className="flex items-center justify-center rounded-lg border border-border bg-muted/30 px-4 py-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Translating...
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={translatedText}
                    onChange={(e) => setTranslatedText(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Translation will appear here..."
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setTranslationDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyTranslation}
                disabled={isTranslating || !translatedText}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Overwrite Description
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
