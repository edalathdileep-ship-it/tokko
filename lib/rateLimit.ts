// ── Server-side rate limiting via Supabase ────────────────
import { createClient } from '@supabase/supabase-js'

// Use service role key for server-side operations (bypasses RLS safely)
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export async function checkAndIncrementUsage(userId: string): Promise<{
  allowed: boolean
  used: number
  limit: number
  plan: 'free' | 'pro' | 'teams'
}> {
  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // Get or create user profile
  let { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Create profile if doesn't exist
  if (!profile) {
    const { data: newProfile } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        plan: 'free',
        compressions_today: 0,
        total_compressions: 0,
        total_tokens_saved: 0,
        total_cost_saved: 0,
        last_reset_date: today,
      })
      .select()
      .single()
    profile = newProfile
  }

  if (!profile) {
    // If DB fails, allow but log — don't block users due to DB issues
    return { allowed: true, used: 0, limit: 50, plan: 'free' }
  }

  const plan = profile.plan as 'free' | 'pro' | 'teams'
  const limits = { free: 50, pro: Infinity, teams: Infinity }
  const limit = limits[plan]

  // Reset daily count if it's a new day
  let compressionsToday = profile.compressions_today
  if (profile.last_reset_date !== today) {
    compressionsToday = 0
    await supabase
      .from('user_profiles')
      .update({ compressions_today: 0, last_reset_date: today })
      .eq('user_id', userId)
  }

  // Check limit
  if (plan === 'free' && compressionsToday >= limit) {
    return { allowed: false, used: compressionsToday, limit, plan }
  }

  // Increment usage
  await supabase
    .from('user_profiles')
    .update({
      compressions_today: compressionsToday + 1,
      total_compressions: profile.total_compressions + 1,
      last_reset_date: today,
    })
    .eq('user_id', userId)

  return { allowed: true, used: compressionsToday + 1, limit, plan }
}

export async function saveCompression(
  userId: string,
  data: {
    original: string
    compressed: string
    originalTokens: number
    compressedTokens: number
    savedPct: number
    mode: string
    model: string
    costSaved: number
    savedTokens: number
  }
) {
  const supabase = getSupabaseAdmin()

  // Save compression record
  await supabase.from('compressions').insert({
    user_id: userId,
    original_text: data.original,
    compressed_text: data.compressed,
    original_tokens: data.originalTokens,
    compressed_tokens: data.compressedTokens,
    saved_pct: data.savedPct,
    mode: data.mode,
    model: data.model,
    cost_saved: data.costSaved,
  })

  // Fetch current profile to get existing totals
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('total_tokens_saved, total_cost_saved')
    .eq('user_id', userId)
    .single()

  if (!profile) return

  // Update lifetime stats — increment, don't replace
  await supabase
    .from('user_profiles')
    .update({
      total_tokens_saved: (profile.total_tokens_saved || 0) + data.savedTokens,
      total_cost_saved: (profile.total_cost_saved || 0) + data.costSaved,
    })
    .eq('user_id', userId)
}