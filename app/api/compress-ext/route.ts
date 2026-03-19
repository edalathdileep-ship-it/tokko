import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compressWithClaude, mockCompress } from '@/lib/compression'
import { sanitizePrompt, isPromptTooLarge, safeErrorMessage } from '@/lib/security'
import { checkAndIncrementUsage, saveCompression } from '@/lib/rateLimit'
import { createClient } from '@supabase/supabase-js'

const schema = z.object({
  prompt: z.string().min(1).max(200_000),
  mode:   z.enum(['balanced', 'aggressive', 'smart']),
  model:  z.enum(['claude', 'gpt4', 'gemini']),
})

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. CORS headers for extension ─────────────────────
    const origin = req.headers.get('origin') || ''
    const allowedOrigins = ['https://claude.ai', 'https://chatgpt.com', 'https://gemini.google.com']
    const corsOrigin = allowedOrigins.includes(origin) || origin.startsWith('chrome-extension://')
      ? origin
      : 'https://claude.ai'

    const headers = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-tokko-token',
    }

    // ── 2. Validate API token ──────────────────────────────
    const token = req.headers.get('x-tokko-token')
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'API token required' },
        { status: 401, headers }
      )
    }

    // Look up token in Supabase
    const supabase = getSupabaseAdmin()
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, plan')
      .eq('api_token', token)
      .single()

    if (profileError) console.error('[compress-ext] Token lookup error:', profileError)

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid API token — regenerate from Settings' },
        { status: 401, headers }
      )
    }

    const userId = profile.user_id

    // ── 3. Parse and validate body ─────────────────────────
    const body = await req.json()
    if (!body?.prompt?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a prompt first' },
        { status: 400, headers }
      )
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400, headers }
      )
    }

    const { prompt: rawPrompt, mode, model } = parsed.data
    const prompt = sanitizePrompt(rawPrompt)

    if (isPromptTooLarge(prompt)) {
      return NextResponse.json(
        { success: false, error: 'Prompt too large' },
        { status: 400, headers }
      )
    }

    // ── 4. Rate limit check ────────────────────────────────
    const usage = await checkAndIncrementUsage(userId)
    if (!usage.allowed) {
      return NextResponse.json(
        { success: false, error: 'Daily limit reached. Upgrade to Pro for unlimited.', limitReached: true },
        { status: 429, headers }
      )
    }

    // ── 5. Compress ────────────────────────────────────────
    // BYOK key takes priority over our server key
    const { data: fullProfile } = await supabase
      .from('user_profiles')
      .select('byok_key')
      .eq('user_id', userId)
      .single()

    const apiKey = fullProfile?.byok_key || process.env.ANTHROPIC_API_KEY
    const result = apiKey
      ? await compressWithClaude(prompt, mode, model, apiKey)
      : mockCompress(prompt, mode, model)

    // ── 6. Save to Supabase ────────────────────────────────
    await saveCompression(userId, {
      original: result.original,
      compressed: result.compressed,
      originalTokens: result.originalTokens,
      compressedTokens: result.compressedTokens,
      savedPct: result.savedPct,
      savedTokens: result.savedTokens,
      mode: result.mode,
      model: result.model,
      costSaved: result.costSaved,
    }).catch((err) => console.error('[Extension save error]', err))

    return NextResponse.json({ success: true, data: result }, { headers })

  } catch (err) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(err) },
      { status: 500 }
    )
  }
}

// Handle preflight
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': origin.startsWith('chrome-extension://') ? origin : 'https://claude.ai',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-tokko-token',
    }
  })
}