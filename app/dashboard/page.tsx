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

  const statCards = [
    {
      label: 'Tokens saved',
      value: stats && stats.totalTokensSaved > 0 ? formatNumber(stats.totalTokensSaved) : '—',
      accent: true,
    },
    {
      label: 'Compressions',
      value: stats && stats.totalCompressions > 0 ? stats.totalCompressions.toString() : '—',
    },
    {
      label: 'Avg reduction',
      value: stats && stats.avgReduction > 0 ? `${stats.avgReduction}%` : '—',
    },
    {
      label: 'Cost saved',
      value: stats ? formatCost(stats.totalCostSaved) : '—',
    },
  ]

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-1">
            Hey, {firstName} 👋
          </h1>
          <p className="text-text-muted font-sans text-[0.95rem]">
            Ready to compress some prompts?
          </p>
        </div>

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

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Optimizer */}
        <Optimizer />

      </main>
    </div>
  )
}