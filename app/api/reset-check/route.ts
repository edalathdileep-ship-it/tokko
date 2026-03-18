import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ reset: false }, { status: 401 })

  const supabase = getSupabaseAdmin()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('compressions_today, last_reset_date, plan')
    .eq('user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ reset: false })

  // Only reset free plan users
  if (profile.plan !== 'free') return NextResponse.json({ reset: false })

  // Check if 24 hours have passed
  const lastResetMs = profile.last_reset_date
    ? new Date(profile.last_reset_date).getTime()
    : 0
  const hoursSinceReset = (Date.now() - lastResetMs) / (1000 * 60 * 60)

  if (hoursSinceReset >= 24 && profile.compressions_today > 0) {
    await supabase
      .from('user_profiles')
      .update({
        compressions_today: 0,
        last_reset_date: new Date().toISOString()
      })
      .eq('user_id', userId)

    return NextResponse.json({ reset: true })
  }

  return NextResponse.json({ reset: false })
}