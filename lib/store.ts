import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  CompressResult,
  CompressionMode,
  ModelType,
  HistoryEntry,
  User,
} from '@/types'

// ── Optimizer Store ───────────────────────────────────────
interface OptimizerStore {
  input: string
  result: CompressResult | null
  mode: CompressionMode
  model: ModelType
  isLoading: boolean
  error: string | null
  setInput: (input: string) => void
  setResult: (result: CompressResult | null) => void
  setMode: (mode: CompressionMode) => void
  setModel: (model: ModelType) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useOptimizerStore = create<OptimizerStore>((set) => ({
  input: '' as string,
  result: null,
  mode: 'balanced',
  model: 'claude',
  isLoading: false,
  error: null,
  setInput:   (input)   => set({ input }),
  setResult:  (result)  => set({ result }),
  setMode:    (mode)    => set({ mode }),
  setModel:   (model)   => set({ model }),
  setLoading: (isLoading) => set({ isLoading }),
  setError:   (error)   => set({ error }),
  reset: () => set({ input: '', result: null, error: null, isLoading: false }),
}))

// ── History Store (persisted to localStorage) ─────────────
interface HistoryStore {
  entries: HistoryEntry[]
  addEntry: (entry: HistoryEntry) => void
  removeEntry: (id: string) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [entry, ...state.entries].slice(0, 100), // keep last 100
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearHistory: () => set({ entries: [] }),
    }),
    { name: 'ps-history' }
  )
)

// ── User / Settings Store (persisted) ─────────────────────
interface UserStore {
  apiKey: string | null
  model: ModelType
  dailyUsage: number
  plan: 'free' | 'pro' | 'teams'
  setApiKey: (key: string | null) => void
  setModel: (model: ModelType) => void
  incrementUsage: () => void
  resetUsage: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      apiKey: null,
      model: 'claude',
      dailyUsage: 0,
      plan: 'free',
      setApiKey: (apiKey) => set({ apiKey }),
      setModel:  (model)  => set({ model }),
      incrementUsage: () => set((s) => ({ dailyUsage: s.dailyUsage + 1 })),
      resetUsage: () => set({ dailyUsage: 0 }),
    }),
    { name: 'ps-user' }
  )
)