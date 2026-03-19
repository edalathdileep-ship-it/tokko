'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Compression = {
  id: string
  original_text: string
  compressed_text: string
  original_tokens: number
  compressed_tokens: number
  saved_pct: number
  mode: string
  model: string
  cost_saved: number
  created_at: string
}

const MODE_COLORS: Record<string, string> = {
  balanced:   'text-blue-400 bg-blue-400/10',
  aggressive: 'text-red-400 bg-red-400/10',
  smart:      'text-accent bg-accent/10',
}

const MODEL_LABELS: Record<string, string> = {
  claude: 'Claude',
  gpt4:   'GPT-4o',
  gemini: 'Gemini',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  return `${days}d ago`
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text
}

export function HistoryClient({ history, fetchError = false }: { history: Compression[]; fetchError?: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mb-4 text-2xl">
          ⚠️
        </div>
        <h3 className="font-grotesk font-bold text-[1.1rem] mb-2">Could not load history</h3>
        <p className="text-text-muted font-sans text-[0.9rem] mb-6">
          Something went wrong connecting to the database. Your compressions are safe — try refreshing.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="font-grotesk font-medium text-[0.88rem] text-accent hover:underline"
        >
          Refresh page →
        </button>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4 text-2xl">
          📭
        </div>
        <h3 className="font-grotesk font-bold text-[1.1rem] mb-2">No compressions yet</h3>
        <p className="text-text-muted font-sans text-[0.9rem] mb-6">
          Head back to the dashboard and compress your first prompt!
        </p>
        <a
          href="/dashboard"
          className="font-grotesk font-medium text-[0.88rem] text-accent hover:underline"
        >
          Go to dashboard →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[0.65rem] text-text-muted tracking-[0.08em] uppercase">
          {history.length} compression{history.length !== 1 ? 's' : ''}
        </span>
      </div>

      {history.map((item) => {
        const isOpen = expanded === item.id

        return (
          <div
            key={item.id}
            className={cn(
              'bg-bg-card border rounded-2xl overflow-hidden transition-all',
              isOpen ? 'border-accent/30' : 'border-border hover:border-border/80'
            )}
          >
            {/* Row header — always visible */}
            <button
              onClick={() => setExpanded(isOpen ? null : item.id)}
              className="w-full px-5 py-4 flex items-center gap-4 text-left"
            >
              {/* Reduction badge */}
              <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex flex-col items-center justify-center">
                <span className="font-grotesk font-bold text-accent text-[1rem] leading-none">
                  {item.saved_pct}%
                </span>
                <span className="font-mono text-[0.52rem] text-accent/70 mt-0.5">saved</span>
              </div>

              {/* Preview text */}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[0.85rem] text-text truncate">
                  {truncate(item.original_text, 80)}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[0.62rem] text-text-muted">
                    {item.original_tokens} → {item.compressed_tokens} tokens
                  </span>
                  <span className={cn(
                    'font-mono text-[0.6rem] px-2 py-0.5 rounded-full capitalize',
                    MODE_COLORS[item.mode] ?? 'text-text-muted bg-bg-surface'
                  )}>
                    {item.mode}
                  </span>
                  <span className="font-mono text-[0.62rem] text-text-muted">
                    {MODEL_LABELS[item.model] ?? item.model}
                  </span>
                </div>
              </div>

              {/* Right side */}
              <div className="shrink-0 flex items-center gap-3">
                <span className="font-mono text-[0.65rem] text-text-muted hidden sm:block">
                  {timeAgo(item.created_at)}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={cn('text-text-muted transition-transform', isOpen && 'rotate-180')}
                >
                  <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                  {/* Original */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[0.62rem] text-text-muted tracking-[0.08em] uppercase">
                        Original · {item.original_tokens} tokens
                      </span>
                    </div>
                    <div className="bg-bg-surface border border-border rounded-xl p-3 font-mono text-[0.78rem] text-text-muted whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {item.original_text}
                    </div>
                  </div>

                  {/* Compressed */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[0.62rem] text-accent tracking-[0.08em] uppercase">
                        Compressed · {item.compressed_tokens} tokens
                      </span>
                      <button
                        onClick={() => handleCopy(item.compressed_text, item.id)}
                        className="font-mono text-[0.62rem] text-text-muted hover:text-accent transition-colors"
                      >
                        {copied === item.id ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-bg-surface border border-accent/20 rounded-xl p-3 font-mono text-[0.78rem] text-text whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {item.compressed_text}
                    </div>
                  </div>

                </div>

                {/* Stats row */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                  <div>
                    <span className="font-mono text-[0.6rem] text-text-muted uppercase tracking-wider">Tokens saved</span>
                    <p className="font-grotesk font-bold text-[0.95rem] mt-0.5">
                      {item.original_tokens - item.compressed_tokens}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[0.6rem] text-text-muted uppercase tracking-wider">Cost saved</span>
                    <p className="font-grotesk font-bold text-[0.95rem] mt-0.5 text-accent">
                      ${item.cost_saved.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[0.6rem] text-text-muted uppercase tracking-wider">Date</span>
                    <p className="font-grotesk font-bold text-[0.95rem] mt-0.5">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}