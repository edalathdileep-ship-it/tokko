// ── Compression ──────────────────────────────────────────
export type CompressionMode = 'balanced' | 'aggressive' | 'smart'
export type ModelType = 'claude' | 'gpt4' | 'gemini'

export interface CompressRequest {
  prompt: string
  mode: CompressionMode
  model: ModelType
}

export interface CompressResult {
  original: string
  compressed: string
  originalTokens: number
  compressedTokens: number
  savedTokens: number
  savedPct: number
  costSaved: number
  mode: CompressionMode
  model: ModelType
  timestamp: string
  id: string
}

export interface CompressResponse {
  success: boolean
  data?: CompressResult
  error?: string
}

// ── History ───────────────────────────────────────────────
export interface HistoryEntry extends CompressResult {}

// ── Analytics ────────────────────────────────────────────
export interface DailyStats {
  date: string
  original: number
  compressed: number
  saved: number
}

export interface AnalyticsSummary {
  totalCompressions: number
  totalTokensSaved: number
  totalCostSaved: number
  avgSavedPct: number
  dailyStats: DailyStats[]
  byModel: Record<ModelType, number>
  byMode: Record<CompressionMode, number>
}

// ── User / Auth ───────────────────────────────────────────
export type PlanType = 'free' | 'pro' | 'teams'

export interface User {
  id: string
  email: string
  name: string
  plan: PlanType
  dailyUsage: number
  dailyLimit: number
  apiKeys: {
    claude?: string
    gpt4?: string
    gemini?: string
  }
  createdAt: string
}

// ── UI State ─────────────────────────────────────────────
export interface OptimizerState {
  input: string
  result: CompressResult | null
  mode: CompressionMode
  model: ModelType
  isLoading: boolean
  error: string | null
}

// ── Pricing ───────────────────────────────────────────────
export interface PricingPlan {
  id: PlanType
  name: string
  monthlyPrice: number
  annualPrice: number
  description: string
  features: PricingFeature[]
  cta: string
  featured: boolean
}

export interface PricingFeature {
  label: string
  included: boolean
  note?: string
}

// ── Token cost per model (per 1k tokens, in USD) ──────────
export const TOKEN_COSTS: Record<ModelType, number> = {
  claude:  0.000003,  // Claude Sonnet ~$3/MTok input
  gpt4:    0.000005,  // GPT-4o ~$5/MTok input
  gemini:  0.0000015, // Gemini 1.5 Pro ~$1.5/MTok
}

// ── Daily limits per plan ─────────────────────────────────
export const PLAN_LIMITS: Record<PlanType, number> = {
  free:  50,
  pro:   Infinity,
  teams: Infinity,
}
