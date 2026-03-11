import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type CompressionRecord = {
  id: string
  user_id: string
  original_text: string
  compressed_text: string
  original_tokens: number
  compressed_tokens: number
  saved_pct: number
  mode: 'balanced' | 'aggressive' | 'smart'
  model: string
  cost_saved: number
  created_at: string
}

export type UserProfile = {
  id: string
  user_id: string
  plan: 'free' | 'pro' | 'teams'
  compressions_today: number
  total_compressions: number
  total_tokens_saved: number
  total_cost_saved: number
  last_reset_date: string
  created_at: string
}
