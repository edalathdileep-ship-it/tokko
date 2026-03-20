'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

type CompareResult = {
  original: { prompt: string; output: string; tokens: number }
  compressed: { prompt: string; output: string; tokens: number }
  savings: { tokens_saved: number; reduction_pct: number; mode: string }
}

type Mode = 'balanced' | 'aggressive' | 'smart'

const MODES: { value: Mode; label: string; desc: string }[] = [
  { value: 'balanced', label: 'Balanced', desc: '~50% reduction' },
  { value: 'aggressive', label: 'Aggressive', desc: '~75% reduction' },
  { value: 'smart', label: 'Smart', desc: 'AI-powered' },
]

export function PlaygroundClient() {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<Mode>('balanced')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<CompareResult | null>(null)

  async function handleCompare() {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 60000)

      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      const json = await res.json()
      if (!json.success) {
        setError(json.error || 'Comparison failed')
      } else {
        setResult(json.data)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Comparison timed out. Try a shorter prompt.')
      } else if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('No internet connection. Check your network and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Info banner */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl px-5 py-4 mb-6">
        <p className="font-sans text-[0.84rem] text-text-muted leading-relaxed">
          <span className="text-accent font-medium">How this works:</span> Paste a prompt below. Tokko will
          compress it, then send both the original and compressed versions to Claude. You see both
          AI responses side by side so you can judge the quality yourself.
        </p>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-text-muted">
            Your prompt
          </span>
          <span className="font-mono text-[0.65rem] text-text-muted">
            {Math.ceil(prompt.length / 4)} tokens (est.)
          </span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setError('') }}
          placeholder="Paste any prompt here. For best results, try a real prompt you use regularly."
          className={cn(
            'w-full h-[140px] p-4 rounded-2xl bg-bg-surface border font-mono text-[0.8rem] text-text',
            'placeholder:text-text-muted resize-none outline-none transition-colors',
            'focus:border-accent',
            error ? 'border-accent-red' : 'border-border'
          )}
        />
        {error && (
          <p className="mt-2 font-mono text-[0.7rem] text-accent-red">{error}</p>
        )}
      </div>

      {/* Mode selector + Compare button */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                'px-3 py-2 rounded-lg border font-grotesk font-medium text-[0.78rem] transition-all',
                mode === m.value
                  ? 'border-accent/40 bg-accent/4 text-text'
                  : 'border-border bg-bg-surface text-text-muted hover:text-text'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button
          onClick={handleCompare}
          disabled={!prompt.trim() || loading}
          loading={loading}
          size="lg"
        >
          {loading ? 'Comparing...' : 'Compare outputs'}
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-bg-card border border-border rounded-2xl p-8 text-center">
          <div className="flex gap-1 justify-center mb-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="font-sans text-[0.88rem] text-text-muted">
            Compressing your prompt, then sending both versions to Claude...
          </p>
          <p className="font-mono text-[0.68rem] text-text-muted mt-2">
            This takes 10-20 seconds because it runs three AI calls.
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">

          {/* Savings banner */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="font-grotesk font-bold text-[1.6rem] text-accent">
                {result.savings.reduction_pct}%
              </div>
              <div>
                <div className="font-grotesk font-bold text-[0.88rem]">
                  {result.savings.tokens_saved} tokens saved
                </div>
                <div className="font-mono text-[0.65rem] text-text-muted mt-0.5">
                  {result.original.tokens} → {result.compressed.tokens} tokens · {result.savings.mode} mode
                </div>
              </div>
            </div>
            <div className="font-mono text-[0.72rem] text-text-muted">
              Now compare the outputs below
            </div>
          </div>

          {/* Prompts comparison */}
          <div>
            <h3 className="font-grotesk font-bold text-[0.94rem] mb-3">Prompts sent to Claude</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[0.62rem] text-text-muted tracking-[0.08em] uppercase">
                    Original · {result.original.tokens} tokens
                  </span>
                </div>
                <div className="bg-bg-surface border border-border rounded-xl p-4 font-mono text-[0.78rem] text-text-muted whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {result.original.prompt}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[0.62rem] text-accent tracking-[0.08em] uppercase">
                    Compressed · {result.compressed.tokens} tokens
                  </span>
                </div>
                <div className="bg-bg-surface border border-accent/20 rounded-xl p-4 font-mono text-[0.78rem] text-accent whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {result.compressed.prompt}
                </div>
              </div>
            </div>
          </div>

          {/* Outputs comparison */}
          <div>
            <h3 className="font-grotesk font-bold text-[0.94rem] mb-3">What Claude responded</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <span className="font-mono text-[0.62rem] text-text-muted tracking-[0.08em] uppercase">
                    Response to original
                  </span>
                </div>
                <div className="bg-bg-card border border-border rounded-xl p-4 font-sans text-[0.84rem] text-text whitespace-pre-wrap max-h-[400px] overflow-y-auto leading-relaxed">
                  {result.original.output}
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <span className="font-mono text-[0.62rem] text-accent tracking-[0.08em] uppercase">
                    Response to compressed
                  </span>
                </div>
                <div className="bg-bg-card border border-accent/20 rounded-xl p-4 font-sans text-[0.84rem] text-text whitespace-pre-wrap max-h-[400px] overflow-y-auto leading-relaxed">
                  {result.compressed.output}
                </div>
              </div>
            </div>
          </div>

          {/* Verdict helper */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 text-center">
            <h3 className="font-grotesk font-bold text-[0.94rem] mb-2">Are the responses similar enough?</h3>
            <p className="font-sans text-[0.84rem] text-text-muted leading-relaxed max-w-lg mx-auto">
              If both responses answer the question the same way, compression worked.
              Small wording differences are normal. Even sending the same prompt twice gives slightly different responses.
              What matters is whether the meaning and quality are the same.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
