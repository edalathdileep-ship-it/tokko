'use client'
import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────
interface DailyData {
  date: string
  label: string
  compressions: number
  tokensSaved: number
  costSaved: number
}

interface AnalyticsData {
  totalCompressions: number
  totalTokensSaved: number
  totalCostSaved: number
  avgSavedPct: number
  daily: DailyData[]
  byMode: Record<string, number>
  byModel: Record<string, number>
  streak: number
  peakDay: { date: string; compressions: number } | null
}

// ── Theme colors ─────────────────────────────────────────
const ACCENT = '#00e5a0'
const ACCENT_DIM = 'rgba(0, 229, 160, 0.15)'
const PURPLE = '#7b61ff'
const RED = '#ff6b6b'
const ORANGE = '#ff9f43'
const TEAL = '#4ecdc4'
const MUTED = '#6b6b85'
const BG_CARD = '#13131e'
const BG_SURFACE = '#111118'
const BORDER = '#2a2a3a'
const TEXT = '#e8e8f0'

const MODE_COLORS: Record<string, string> = {
  balanced: TEAL,
  aggressive: RED,
  smart: ACCENT,
}

const MODE_LABELS: Record<string, string> = {
  balanced: 'Balanced',
  aggressive: 'Aggressive',
  smart: 'Smart',
}

const MODEL_COLORS: Record<string, string> = {
  claude: PURPLE,
  gpt4: ACCENT,
  gemini: ORANGE,
}

const MODEL_LABELS: Record<string, string> = {
  claude: 'Claude',
  gpt4: 'GPT-4o',
  gemini: 'Gemini',
}

// ── Helpers ──────────────────────────────────────────────
function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

function formatCost(n: number): string {
  if (n === 0) return '$0'
  if (n < 0.01) return '<$0.01'
  if (n < 1) return `$${n.toFixed(3)}`
  return `$${n.toFixed(2)}`
}

// ── Custom tooltip ───────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card border border-border rounded-xl px-3 py-2 shadow-card">
      <p className="font-mono text-[0.62rem] text-text-muted mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-mono text-[0.72rem]" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('cost')
            ? formatCost(entry.value)
            : formatNumber(entry.value)}
        </p>
      ))}
    </div>
  )
}

// ── Loading skeleton ─────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-2xl bg-bg-s2', className)} />
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-72" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}

// ── Error state ──────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mb-4 text-2xl">
        ⚠️
      </div>
      <h3 className="font-grotesk font-bold text-[1.1rem] mb-2">Could not load analytics</h3>
      <p className="text-text-muted font-sans text-[0.9rem] mb-6">
        Something went wrong loading your data. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="font-grotesk font-medium text-[0.88rem] text-accent hover:underline"
      >
        Retry →
      </button>
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4 text-2xl">
        📊
      </div>
      <h3 className="font-grotesk font-bold text-[1.1rem] mb-2">No data yet</h3>
      <p className="text-text-muted font-sans text-[0.9rem] mb-6">
        Compress some prompts and your analytics will show up here.
      </p>
      <a
        href="/dashboard"
        className="font-grotesk font-medium text-[0.88rem] text-accent hover:underline"
      >
        Go compress →
      </a>
    </div>
  )
}

// ── Stat card ────────────────────────────────────────────
function StatCard({ label, value, sub, accent }: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5">
      <div className={cn(
        'font-grotesk font-bold text-[1.6rem] tracking-tight mb-1',
        accent ? 'text-accent' : 'text-text'
      )}>
        {value}
      </div>
      <div className="font-mono text-[0.62rem] text-text-muted tracking-[0.08em] uppercase">
        {label}
      </div>
      {sub && (
        <div className="font-mono text-[0.58rem] text-text-muted mt-1">{sub}</div>
      )}
    </div>
  )
}

// ── Section wrapper ──────────────────────────────────────
function ChartSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-grotesk font-bold text-[0.88rem]">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

// ── Donut chart component ────────────────────────────────
function DonutChart({ data, colors, labels }: {
  data: Record<string, number>
  colors: Record<string, string>
  labels: Record<string, string>
}) {
  const total = Object.values(data).reduce((sum, v) => sum + v, 0)
  if (total === 0) {
    return (
      <p className="font-mono text-[0.75rem] text-text-muted text-center py-8">
        No data yet
      </p>
    )
  }

  const pieData = Object.entries(data)
    .filter(([_, v]) => v > 0)
    .map(([key, value]) => ({
      name: labels[key] || key,
      value,
      color: colors[key] || MUTED,
    }))

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={38}
            outerRadius={62}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2.5">
        {pieData.map((entry) => {
          const pct = Math.round((entry.value / total) * 100)
          return (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-mono text-[0.72rem] text-text">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.68rem] text-text-muted">{entry.value}</span>
                <span className="font-mono text-[0.62rem] text-text-muted w-8 text-right">{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────
export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function fetchData() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/analytics')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <LoadingState />
  if (error) return <ErrorState onRetry={fetchData} />
  if (!data || data.totalCompressions === 0) return <EmptyState />

  // Only show last 14 days in charts for readability
  const chartDays = data.daily.slice(-14)

  return (
    <div className="space-y-6">

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total compressions"
          value={formatNumber(data.totalCompressions)}
          sub="last 90 days"
        />
        <StatCard
          label="Tokens saved"
          value={formatNumber(data.totalTokensSaved)}
          accent
        />
        <StatCard
          label="Avg reduction"
          value={`${data.avgSavedPct}%`}
        />
        <StatCard
          label="Cost saved"
          value={formatCost(data.totalCostSaved)}
          accent
        />
      </div>

      {/* ── Streak + peak ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-xl">
            🔥
          </div>
          <div>
            <div className="font-grotesk font-bold text-[1.1rem]">
              {data.streak} day{data.streak !== 1 ? 's' : ''} streak
            </div>
            <div className="font-mono text-[0.65rem] text-text-muted mt-0.5">
              Consecutive days compressing
            </div>
          </div>
        </div>
        {data.peakDay && (
          <div className="bg-bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <div className="font-grotesk font-bold text-[1.1rem]">
                {data.peakDay.compressions} compressions
              </div>
              <div className="font-mono text-[0.65rem] text-text-muted mt-0.5">
                Peak day — {new Date(data.peakDay.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Daily compressions chart ── */}
      <ChartSection title="Daily Compressions">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartDays} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gradAccent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.3} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: MUTED, fontSize: 10, fontFamily: 'DM Mono, monospace' }}
              axisLine={{ stroke: BORDER }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: MUTED, fontSize: 10, fontFamily: 'DM Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="compressions"
              name="Compressions"
              stroke={ACCENT}
              strokeWidth={2}
              fill="url(#gradAccent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* ── Token savings chart ── */}
      <ChartSection title="Tokens Saved per Day">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartDays} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: MUTED, fontSize: 10, fontFamily: 'DM Mono, monospace' }}
              axisLine={{ stroke: BORDER }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: MUTED, fontSize: 10, fontFamily: 'DM Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="tokensSaved"
              name="Tokens saved"
              fill={ACCENT}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* ── Mode + Model breakdowns ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartSection title="By Mode">
          <DonutChart data={data.byMode} colors={MODE_COLORS} labels={MODE_LABELS} />
        </ChartSection>
        <ChartSection title="By Model">
          <DonutChart data={data.byModel} colors={MODEL_COLORS} labels={MODEL_LABELS} />
        </ChartSection>
      </div>

    </div>
  )
}
