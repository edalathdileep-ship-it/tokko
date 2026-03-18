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
    console.error('[rateLimit] Failed to get/create user profile for', userId)
    return { allowed: true, used: 0, limit: 20, plan: 'free' }
  }

  const plan = profile.plan as 'free' | 'pro' | 'teams' | 'byok'
  const limits = { free: 20, byok: Infinity, pro: Infinity, teams: Infinity }
  const limit = limits[plan] ?? 20

  // Reset if 24 hours have passed since last reset
  // Handle both old date strings (2026-03-17) and new ISO timestamps
  let compressionsToday = profile.compressions_today
  let lastResetMs = 0
  if (profile.last_reset_date) {
    const parsed = new Date(profile.last_reset_date)
    // If it's just a date (no time), treat as start of that day UTC
    lastResetMs = isNaN(parsed.getTime()) ? 0 : parsed.getTime()
  }
  const hoursSinceReset = (Date.now() - lastResetMs) / (1000 * 60 * 60)

  if (hoursSinceReset >= 24) {
    compressionsToday = 0
    await supabase
      .from('user_profiles')
      .update({ compressions_today: 0, last_reset_date: new Date().toISOString() })
      .eq('user_id', userId)
  }

  // Check limit
  if ((plan === 'free') && compressionsToday >= limit) {
    return { allowed: false, used: compressionsToday, limit, plan }
  }

  // Increment usage
  await supabase
    .from('user_profiles')
    .update({
      compressions_today: compressionsToday + 1,
      total_compressions: profile.total_compressions + 1,
      last_reset_date: compressionsToday === 0 ? new Date().toISOString() : profile.last_reset_date,
    })
    .eq('user_id', userId)

    return { allowed: true, used: compressionsToday + 1, limit, plan: plan as 'free' | 'pro' | 'teams' }
}

export async function getCompressionHistory(userId: string) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('compressions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[getCompressionHistory error]', error)
    return []
  }

  return data ?? []
}

export async function getUserStats(userId: string): Promise<{
  totalTokensSaved: number
  totalCompressions: number
  avgReduction: number
  totalCostSaved: number
}> {
  const supabase = getSupabaseAdmin()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('total_tokens_saved, total_compressions, total_cost_saved')
    .eq('user_id', userId)
    .single()

  if (!profile) {
    return { totalTokensSaved: 0, totalCompressions: 0, avgReduction: 0, totalCostSaved: 0 }
  }

  // Calculate avg reduction from compressions table
  const { data: compressions } = await supabase
    .from('compressions')
    .select('saved_pct')
    .eq('user_id', userId)

  const avgReduction = compressions && compressions.length > 0
    ? compressions.reduce((sum, c) => sum + (c.saved_pct || 0), 0) / compressions.length
    : 0

  return {
    totalTokensSaved: profile.total_tokens_saved || 0,
    totalCompressions: profile.total_compressions || 0,
    avgReduction: Math.round(avgReduction),
    totalCostSaved: profile.total_cost_saved || 0,
  }
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
  const { error: insertError } = await supabase.from('compressions').insert({
    user_id: userId,
    original_text: data.original,
    compressed_text: data.compressed,
    original_tokens: data.originalTokens,
    compressed_tokens: data.compressedTokens,
    saved_pct: Math.round(data.savedPct),
    mode: data.mode,
    model: data.model,
    cost_saved: data.costSaved,
  })

  if (insertError) {
    console.error('[Supabase compressions insert error]', insertError)
    return
  }

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