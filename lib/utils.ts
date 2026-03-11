import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type ModelType, TOKEN_COSTS } from '@/types'

// ── Tailwind class merger ─────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Token estimation (approximation: 1 token ≈ 4 chars) ──
export function estimateTokens(text: string): number {
  if (!text) return 0
  return Math.ceil(text.length / 4)
}

// ── Cost calculation ──────────────────────────────────────
export function calcCost(tokens: number, model: ModelType): number {
  return tokens * TOKEN_COSTS[model]
}

export function calcCostSaved(
  originalTokens: number,
  compressedTokens: number,
  model: ModelType
): number {
  return calcCost(originalTokens - compressedTokens, model)
}

// ── Format numbers ────────────────────────────────────────
export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function formatCost(n: number): string {
  if (n < 0.001) return `$${(n * 1000).toFixed(3)}m` // millicents
  if (n < 1) return `$${n.toFixed(4)}`
  return `$${n.toFixed(2)}`
}

export function formatPct(n: number): string {
  return `${Math.round(n)}%`
}

// ── Generate unique ID ────────────────────────────────────
export function genId(): string {
  return `ps_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ── Truncate text ─────────────────────────────────────────
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}

// ── Mode descriptions ─────────────────────────────────────
export const MODE_META = {
  balanced: {
    label: 'Balanced',
    icon: '',
    saving: '~50%',
    desc: 'Remove filler, keep full meaning',
  },
  aggressive: {
    label: 'Aggressive',
    icon: '',
    saving: '~75%',
    desc: 'Maximum token reduction',
  },
  smart: {
    label: 'Smart',
    icon: '',
    saving: '~40%',
    desc: 'AI-powered, preserves nuance',
  },
} as const

// ── Model descriptions ────────────────────────────────────
export const MODEL_META = {
  claude: { label: 'Claude Sonnet', color: '#7b61ff', dot: 'bg-accent-purple' },
  gpt4:   { label: 'GPT-4o',       color: '#00e5a0', dot: 'bg-accent' },
  gemini: { label: 'Gemini Pro',   color: '#ff6b6b', dot: 'bg-accent-red' },
} as const

// ── Local storage helpers ─────────────────────────────────
export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch { return null }
  },
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
  },
  remove(key: string): void {
    if (typeof window === 'undefined') return
    try { localStorage.removeItem(key) } catch { /* ignore */ }
  },
}
