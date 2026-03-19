import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    // Fetch all compressions for this user (last 90 days max)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const { data: compressions, error } = await supabase
      .from('compressions')
      .select('original_tokens, compressed_tokens, saved_pct, mode, model, cost_saved, created_at')
      .eq('user_id', userId)
      .gte('created_at', ninetyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[analytics] Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Failed to load analytics' }, { status: 500 })
    }

    const rows = compressions ?? []

    // ── Aggregate by day (last 30 days) ──
    const dailyMap = new Map<string, { compressions: number; tokensSaved: number; costSaved: number }>()

    // Pre-fill last 30 days with zeros
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dailyMap.set(key, { compressions: 0, tokensSaved: 0, costSaved: 0 })
    }

    let totalCompressions = 0
    let totalTokensSaved = 0
    let totalCostSaved = 0
    let totalSavedPct = 0
    const byMode: Record<string, number> = { balanced: 0, aggressive: 0, smart: 0 }
    const byModel: Record<string, number> = { claude: 0, gpt4: 0, gemini: 0 }

    for (const row of rows) {
      const day = row.created_at.split('T')[0]
      const saved = Math.max(0, (row.original_tokens || 0) - (row.compressed_tokens || 0))

      // Daily aggregation
      const existing = dailyMap.get(day)
      if (existing) {
        existing.compressions += 1
        existing.tokensSaved += saved
        existing.costSaved += row.cost_saved || 0
      }

      // Totals
      totalCompressions += 1
      totalTokensSaved += saved
      totalCostSaved += row.cost_saved || 0
      totalSavedPct += row.saved_pct || 0

      // Breakdowns
      if (row.mode in byMode) byMode[row.mode] += 1
      if (row.model in byModel) byModel[row.model] += 1
    }

    const avgSavedPct = totalCompressions > 0
      ? Math.round(totalSavedPct / totalCompressions)
      : 0

    // Convert daily map to sorted array
    const daily = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({
        date,
        label: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...stats,
      }))

    // ── Streak calculation ──
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    const dailyArr = Array.from(dailyMap.entries()).sort(([a], [b]) => b.localeCompare(a)) // newest first
    for (const [date, stats] of dailyArr) {
      // Skip future dates
      if (date > today) continue
      if (stats.compressions > 0) {
        streak++
      } else {
        break
      }
    }

    // ── Peak day ──
    let peakDay = { date: '', compressions: 0 }
    for (const [date, stats] of dailyMap.entries()) {
      if (stats.compressions > peakDay.compressions) {
        peakDay = { date, compressions: stats.compressions }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCompressions,
        totalTokensSaved,
        totalCostSaved,
        avgSavedPct,
        daily,
        byMode,
        byModel,
        streak,
        peakDay: peakDay.compressions > 0 ? peakDay : null,
      },
    })
  } catch (err) {
    console.error('[analytics] Error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
