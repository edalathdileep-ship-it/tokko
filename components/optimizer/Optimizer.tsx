'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Check, RotateCcw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chips'
import { cn, estimateTokens, MODE_META, MODEL_META, formatCost } from '@/lib/utils'
import { useOptimizerStore, useHistoryStore, useUserStore } from '@/lib/store'
import type { CompressionMode, ModelType } from '@/types'

export function Optimizer() {
  const {
    input, result, mode, model,
    isLoading, error,
    setInput, setResult, setMode, setModel,
    setLoading, setError, reset,
  } = useOptimizerStore()

  const { addEntry } = useHistoryStore()
  const { dailyUsage, plan, incrementUsage } = useUserStore()
  const router = useRouter()

  const [copied, setCopied] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  // Clear any stale errors on mount
  useEffect(() => { setError(null) }, [])

  const inputTokens = estimateTokens(input)
  const dailyLimit = plan === 'free' ? 50 : Infinity
  const atLimit = plan === 'free' && dailyUsage >= dailyLimit

  const handleCompress = useCallback(async () => {
    if (!input?.trim() || isLoading || atLimit) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/compress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input ?? '', mode, model }),
      })
      const json = await res.json()

      if (!json.success) throw new Error(json.error)

      setResult(json.data)
      addEntry(json.data)
      incrementUsage()
      // Refresh server component to update dashboard stats
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed')
    } finally {
      setLoading(false)
    }
  }, [input, mode, model, isLoading, atLimit, setLoading, setError, setResult, addEntry, incrementUsage, router])

  const handleCopy = useCallback(() => {
    if (!result) return
    navigator.clipboard.writeText(result.compressed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  return (
    <div className="w-full">

      {/* Mode selector */}
      <div className="flex gap-2 mb-5">
        {(Object.keys(MODE_META) as CompressionMode[]).map((m) => {
          const meta = MODE_META[m]
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg border transition-all text-left',
                mode === m
                  ? 'border-accent bg-accent/4 '
                  : 'border-border bg-bg-card hover:border-border/80'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-grotesk font-bold text-[0.82rem]">
                  {meta.label}
                </span>
                <span className={cn(
                  'font-mono text-[0.62rem] px-2 py-0.5 rounded',
                  mode === m ? 'bg-accent/10 text-accent' : 'bg-bg-s2 text-text-muted'
                )}>
                  {meta.saving}
                </span>
              </div>
              <p className="font-sans text-[0.72rem] text-text-muted">{meta.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Model selector */}
      <div className="flex gap-2 mb-5">
        {(Object.keys(MODEL_META) as ModelType[]).map((m) => {
          const meta = MODEL_META[m]
          return (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border text-[0.8rem] font-grotesk font-medium transition-all',
                model === m
                  ? 'border-accent/40 bg-accent/4 text-text'
                  : 'border-border bg-bg-surface text-text-muted hover:text-text'
              )}
            >
              <span className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ background: meta.color }} />
              {meta.label}
            </button>
          )
        })}
      </div>

      {/* Input / Output panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Input panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-text-muted">
              Original
            </span>
            <span className={cn(
              'font-mono text-[0.68rem] px-2 py-0.5 rounded',
              inputTokens > 0 ? 'text-accent-red bg-accent-red/10 border border-accent-red/25' : 'text-text-muted'
            )}>
              {inputTokens} tokens
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null) }}
            placeholder="Paste your prompt here..."
            className={cn(
              'flex-1 min-h-[200px] p-4 rounded-2xl bg-bg-surface border font-mono text-[0.8rem] text-text',
              'placeholder:text-text-muted resize-none outline-none transition-colors',
              'focus:border-accent',
              (error && input.trim()) ? 'border-accent-red' : 'border-border'
            )}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleCompress()
            }}
          />
          {error && input?.trim() && (
            <p className="mt-2 font-mono text-[0.7rem] text-accent-red">{error}</p>
          )}
        </div>

        {/* Output panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-accent">
              Compressed
            </span>
            {result && (
              <Chip variant="green">
                −{Math.round(result.savedPct)}% · {result.compressedTokens} tokens
              </Chip>
            )}
          </div>
          <div className={cn(
            'flex-1 min-h-[200px] p-4 rounded-2xl border font-mono text-[0.8rem] relative',
            result
              ? 'bg-accent/6 border-accent/20 text-accent'
              : 'bg-bg-surface border-border text-text-muted'
          )}>
            {isLoading ? (
              <div className="flex items-center gap-3 h-full">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-text-muted text-[0.78rem]">Compressing...</span>
              </div>
            ) : result ? (
              <p className="leading-relaxed whitespace-pre-wrap">{result.compressed}</p>
            ) : (
              <p className="text-text-muted text-[0.78rem]">
                Compressed prompt will appear here...
              </p>
            )}
          </div>

          {/* Savings summary */}
          {result && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-2">
                <Chip variant="green">−{Math.round(result.savedPct)}% tokens</Chip>
                <Chip variant="muted">saved {formatCost(result.costSaved)}</Chip>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 font-mono text-[0.68rem] text-text-muted hover:text-accent transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compress button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={atLimit ? () => setShowUpgrade(true) : handleCompress}
          disabled={!input?.trim() || isLoading}
          loading={isLoading}
          size="lg"
          className="flex-1 shadow-compress"
        >
          {isLoading ? 'Compressing...' : atLimit ? '✦ Upgrade to compress more' : (
            <>Compress prompt <ArrowRight size={16} /></>
          )}
        </Button>

        {(result || input) && (
          <Button variant="outline" size="lg" onClick={reset} className="shrink-0">
            <RotateCcw size={15} />
            Reset
          </Button>
        )}
      </div>

      {/* Usage indicator (free plan) */}
      {plan === 'free' && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 h-1 bg-bg-s2 rounded-full overflow-hidden mr-3">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                dailyUsage >= dailyLimit ? 'bg-accent-red' : 'bg-accent'
              )}
              style={{ width: `${Math.min(100, (dailyUsage / dailyLimit) * 100)}%` }}
            />
          </div>
          <span className={cn(
            'font-mono text-[0.65rem] whitespace-nowrap',
            dailyUsage >= dailyLimit ? 'text-accent-red' : 'text-text-muted'
          )}>
            {dailyUsage} / {dailyLimit} today
          </span>
        </div>
      )}

      <p className="mt-3 text-center font-mono text-[0.62rem] text-text-muted">
        ⌘ + Enter to compress
      </p>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUpgrade(false)}
          />
          {/* Modal */}
          <div className="relative bg-bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowUpgrade(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors font-mono text-lg"
            >
              ×
            </button>

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 text-xl">
              ⚡
            </div>

            <h2 className="font-grotesk font-bold text-[1.4rem] tracking-tight mb-2">
              You've hit your daily limit
            </h2>
            <p className="font-sans text-[0.88rem] text-text-muted mb-6">
              You've used all <span className="text-text font-medium">50 free compressions</span> for today.
              Upgrade to Pro for unlimited compressions, all modes, and all models.
            </p>

            {/* Plan comparison */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-bg-surface border border-border rounded-xl p-4">
                <div className="font-grotesk font-bold text-[0.88rem] mb-1">Free</div>
                <div className="font-grotesk font-bold text-[1.4rem] mb-2">$0</div>
                <ul className="space-y-1">
                  {['50/day limit', 'Balanced only', 'Claude only'].map(f => (
                    <li key={f} className="font-mono text-[0.65rem] text-text-muted">· {f}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-accent/5 border border-accent/30 rounded-xl p-4">
                <div className="font-grotesk font-bold text-[0.88rem] text-accent mb-1">Pro</div>
                <div className="font-grotesk font-bold text-[1.4rem] mb-2">$9<span className="text-text-muted font-normal text-[0.78rem]">/mo</span></div>
                <ul className="space-y-1">
                  {['Unlimited', 'All modes', 'All models'].map(f => (
                    <li key={f} className="font-mono text-[0.65rem] text-accent/80">✓ {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={() => { setShowUpgrade(false); window.location.href = '/#pricing' }}>
              Upgrade to Pro →
            </Button>

            <p className="text-center font-mono text-[0.62rem] text-text-muted mt-3">
              Or wait until tomorrow for your free limit to reset
            </p>
          </div>
        </div>
      )}
    </div>
  )
}