import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { compressWithClaude, mockCompress } from '@/lib/compression'
import { sanitizePrompt, isPromptTooLarge, safeErrorMessage } from '@/lib/security'
import { checkAndIncrementUsage, saveCompression } from '@/lib/rateLimit'
import { createClient } from '@supabase/supabase-js'

const schema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(200_000, 'Prompt too long'),
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
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Please sign in to compress prompts' }, { status: 401 })
    }

    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 1_000_000) {
      return NextResponse.json({ success: false, error: 'Request too large' }, { status: 413 })
    }

    const body = await req.json()
    if (!body?.prompt || typeof body.prompt !== 'string' || !body.prompt.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter a prompt first' }, { status: 400 })
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { prompt: rawPrompt, mode, model } = parsed.data
    const prompt = sanitizePrompt(rawPrompt)

    if (isPromptTooLarge(prompt)) {
      return NextResponse.json({ success: false, error: 'Prompt too large. Max 200,000 characters.' }, { status: 400 })
    }

    const usage = await checkAndIncrementUsage(userId)
    if (!usage.allowed) {
      return NextResponse.json({
        success: false,
        error: `Daily limit reached (${usage.limit} compressions/day on free plan). Upgrade to Pro for unlimited.`,
        limitReached: true,
      }, { status: 429 })
    }

    // BYOK key takes priority over our key
    const supabase = getSupabaseAdmin()
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('byok_key')
      .eq('user_id', userId)
      .single()

    const apiKey = profile?.byok_key || process.env.ANTHROPIC_API_KEY

    const result = apiKey
      ? await compressWithClaude(prompt, mode, model, apiKey)
      : mockCompress(prompt, mode, model)

    await saveCompression(userId, {
      original:         result.original,
      compressed:       result.compressed,
      originalTokens:   result.originalTokens,
      compressedTokens: result.compressedTokens,
      savedPct:         result.savedPct,
      savedTokens:      result.savedTokens,
      mode:             result.mode,
      model:            result.model,
      costSaved:        result.costSaved,
    }).catch((err) => console.error('[Supabase save error]', err))

    return NextResponse.json({ success: true, data: result })

  } catch (err: unknown) {
    const safe = safeErrorMessage(err)
    return NextResponse.json({ success: false, error: safe }, { status: 500 })
  }
}