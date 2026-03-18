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
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ used: 0, limit: 20 }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('compressions_today, plan, last_reset_date')
    .eq('user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ used: 0, limit: 20 })

  // Check if reset is due
  const lastResetMs = profile.last_reset_date
    ? new Date(profile.last_reset_date).getTime() : 0
  const hoursSinceReset = (Date.now() - lastResetMs) / (1000 * 60 * 60)

  // Auto reset if 24hrs passed
  if (hoursSinceReset >= 24 && profile.compressions_today > 0) {
    await supabase
      .from('user_profiles')
      .update({ compressions_today: 0, last_reset_date: new Date().toISOString() })
      .eq('user_id', userId)
    return NextResponse.json({ used: 0, limit: 20, reset: true })
  }

  const limits: Record<string, number> = { free: 20, byok: Infinity, pro: Infinity, teams: Infinity }
  const limit = limits[profile.plan] ?? 20

  return NextResponse.json({
    used: profile.compressions_today ?? 0,
    limit,
    plan: profile.plan,
  })
}