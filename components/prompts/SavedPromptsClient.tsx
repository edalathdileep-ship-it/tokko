'use client'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SavedPrompt {
  id: string
  name: string
  original_text: string
  compressed_text: string
  original_tokens: number
  compressed_tokens: number
  saved_pct: number
  mode: string
  created_at: string
  updated_at: string
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  return `${days}d ago`
}

const MODE_COLORS: Record<string, string> = {
  balanced: 'text-teal-400 bg-teal-400/10',
  aggressive: 'text-red-400 bg-red-400/10',
  smart: 'text-accent bg-accent/10',
}

export function SavedPromptsClient() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function fetchPrompts() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/saved-prompts')
      const json = await res.json()
      if (json.success) {
        setPrompts(json.prompts)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPrompts() }, [])

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/saved-prompts?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setPrompts(prev => prev.filter(p => p.id !== id))
        if (expanded === id) setExpanded(null)
      }
    } catch {
      // silent fail
    } finally {
      setDeleting(null)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-2xl bg-bg-s2 animate-pulse" />
        ))}
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h3 className="font-grotesk font-bold text-[1.1rem] mb-2">Could not load saved prompts</h3>
        <p className="text-text-muted font-sans text-[0.9rem] mb-6">
          Something went wrong. Try refreshing the page.
        </p>
        <button onClick={fetchPrompts} className="font-grotesk font-medium text-[0.88rem] text-accent hover:underline">
          Retry
        </button>
      </div>
    )
  }

  // Empty
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b6b85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </div>
        <h3 className="font-grotesk font-bold text-[1.1rem] mb-2">No saved prompts yet</h3>
        <p className="text-text-muted font-sans text-[0.9rem] mb-6 max-w-sm">
          Compress a prompt in the dashboard and click &quot;Save&quot; to store it here for quick reuse.
        </p>
        <a href="/dashboard" className="font-grotesk font-medium text-[0.88rem] text-accent hover:underline">
          Go compress a prompt
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[0.65rem] text-text-muted tracking-[0.08em] uppercase">
          {prompts.length} saved prompt{prompts.length !== 1 ? 's' : ''}
        </span>
        <span className="font-mono text-[0.62rem] text-text-muted">
          {prompts.length} / 20 slots used
        </span>
      </div>

      {prompts.map((p) => {
        const isOpen = expanded === p.id
        return (
          <div
            key={p.id}
            className={cn(
              'bg-bg-card border rounded-2xl overflow-hidden transition-all',
              isOpen ? 'border-accent/30' : 'border-border hover:border-border/80'
            )}
          >
            {/* Row header */}
            <button
              onClick={() => setExpanded(isOpen ? null : p.id)}
              className="w-full px-5 py-4 flex items-center gap-4 text-left"
            >
              {/* Reduction badge */}
              <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex flex-col items-center justify-center">
                <span className="font-grotesk font-bold text-accent text-[1rem] leading-none">
                  {p.saved_pct}%
                </span>
                <span className="font-mono text-[0.52rem] text-accent/70 mt-0.5">saved</span>
              </div>

              {/* Name + preview */}
              <div className="flex-1 min-w-0">
                <p className="font-grotesk font-bold text-[0.88rem] truncate">{p.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[0.62rem] text-text-muted">
                    {p.original_tokens} → {p.compressed_tokens} tokens
                  </span>
                  <span className={cn(
                    'font-mono text-[0.6rem] px-2 py-0.5 rounded-full capitalize',
                    MODE_COLORS[p.mode] ?? 'text-text-muted bg-bg-surface'
                  )}>
                    {p.mode}
                  </span>
                </div>
              </div>

              {/* Right side */}
              <div className="shrink-0 flex items-center gap-3">
                <span className="font-mono text-[0.65rem] text-text-muted hidden sm:block">
                  {timeAgo(p.updated_at)}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={cn('text-text-muted transition-transform', isOpen && 'rotate-180')}
                >
                  <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Expanded */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                  {/* Original */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[0.62rem] text-text-muted tracking-[0.08em] uppercase">
                        Original · {p.original_tokens} tokens
                      </span>
                    </div>
                    <div className="bg-bg-surface border border-border rounded-xl p-3 font-mono text-[0.78rem] text-text-muted whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {p.original_text}
                    </div>
                  </div>

                  {/* Compressed */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[0.62rem] text-accent tracking-[0.08em] uppercase">
                        Compressed · {p.compressed_tokens} tokens
                      </span>
                      <button
                        onClick={() => handleCopy(p.compressed_text, p.id)}
                        className="font-mono text-[0.62rem] text-text-muted hover:text-accent transition-colors"
                      >
                        {copied === p.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-bg-surface border border-accent/20 rounded-xl p-3 font-mono text-[0.78rem] text-text whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {p.compressed_text}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => handleCopy(p.compressed_text, p.id + '-btn')}
                    className="font-grotesk font-medium text-[0.82rem] text-accent border border-accent/30 px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    {copied === p.id + '-btn' ? 'Copied to clipboard' : 'Copy compressed prompt'}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="font-mono text-[0.72rem] text-accent-red hover:underline disabled:opacity-50"
                  >
                    {deleting === p.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
