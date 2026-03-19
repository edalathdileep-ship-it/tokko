import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Optimizer } from '@/components/optimizer/Optimizer'
import { getUserStats } from '@/lib/rateLimit'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

function formatCost(n: number): string {
  if (n === 0) return '—'
  if (n < 0.01) return '<$0.01'
  return `$${n.toFixed(2)}`
}

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/auth/signin')

  const firstName = user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there'

  // Fetch real stats from Supabase
  const stats = await getUserStats(user.id).catch(() => null)
  const statsError = stats === null

  const statCards = [
    {
      label: 'Tokens saved',
      value: statsError ? '—' : stats.totalTokensSaved > 0 ? formatNumber(stats.totalTokensSaved) : '0',
      accent: true,
    },
    {
      label: 'Compressions',
      value: statsError ? '—' : stats.totalCompressions > 0 ? stats.totalCompressions.toString() : '0',
    },
    {
      label: 'Avg reduction',
      value: statsError ? '—' : stats.avgReduction > 0 ? `${stats.avgReduction}%` : '0%',
    },
    {
      label: 'Cost saved',
      value: statsError ? '—' : formatCost(stats.totalCostSaved),
    },
  ]

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-1">
            Hey, {firstName}
          </h1>
          <p className="text-text-muted font-sans text-[0.95rem]">
            Ready to compress some prompts?
          </p>
        </div>

        {/* Stats error banner */}
        {statsError && (
          <div className="flex items-center gap-3 bg-accent-orange/5 border border-accent-orange/20 rounded-2xl px-5 py-3 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="font-mono text-[0.72rem] text-accent-orange">
              Could not load your stats right now. Your compressions still work — stats will update once the connection is restored.
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="bg-bg-card border border-border rounded-2xl p-5">
              <div className={`font-grotesk font-bold text-[1.6rem] tracking-tight mb-1.5 ${s.accent ? 'text-accent' : ''}`}>
                {s.value}
              </div>
              <div className="font-mono text-[0.62rem] text-text-muted tracking-[0.08em] uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Analytics link */}
        {!statsError && stats && stats.totalCompressions > 0 && (
          <div className="mb-4 flex justify-end">
            <a
              href="/dashboard/analytics"
              className="font-mono text-[0.68rem] text-text-muted hover:text-accent transition-colors"
            >
              View detailed analytics →
            </a>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Optimizer */}
        <Optimizer />

      </main>
    </div>
  )
}