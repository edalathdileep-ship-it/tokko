import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { compressWithClaude } from '@/lib/compression'
import { sanitizePrompt, isPromptTooLarge, safeErrorMessage } from '@/lib/security'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import type { CompressionMode, ModelType } from '@/types'

const schema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(50_000, 'Prompt too long for comparison (max 50k chars)'),
  mode: z.enum(['balanced', 'aggressive', 'smart']).default('balanced'),
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
      return NextResponse.json({ success: false, error: 'Please sign in first' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { prompt: rawPrompt, mode } = parsed.data
    const prompt = sanitizePrompt(rawPrompt)

    if (isPromptTooLarge(prompt)) {
      return NextResponse.json({ success: false, error: 'Prompt too large for comparison' }, { status: 400 })
    }

    // Get API key (BYOK or server)
    const supabase = getSupabaseAdmin()
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('byok_key')
      .eq('user_id', userId)
      .single()

    const apiKey = profile?.byok_key || process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'No API key available' }, { status: 500 })
    }

    // 1. Compress the prompt
    const compression = await compressWithClaude(prompt, mode as CompressionMode, 'claude' as ModelType, apiKey)

    // 2. Send BOTH prompts to Claude and get responses
    const client = new Anthropic({ apiKey })

    const [originalResponse, compressedResponse] = await Promise.all([
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: compression.compressed }],
      }),
    ])

    const originalOutput = (originalResponse.content[0] as { type: 'text'; text: string }).text
    const compressedOutput = (compressedResponse.content[0] as { type: 'text'; text: string }).text

    return NextResponse.json({
      success: true,
      data: {
        original: {
          prompt: prompt,
          output: originalOutput,
          tokens: compression.originalTokens,
        },
        compressed: {
          prompt: compression.compressed,
          output: compressedOutput,
          tokens: compression.compressedTokens,
        },
        savings: {
          tokens_saved: compression.savedTokens,
          reduction_pct: compression.savedPct,
          mode: compression.mode,
        },
      },
    })
  } catch (err: any) {
    console.error('[compare]', err)

    const status = err?.status || err?.statusCode
    if (status === 529 || status === 503) {
      return NextResponse.json(
        { success: false, error: 'Claude is busy right now. Try again in a few seconds.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { success: false, error: safeErrorMessage(err) },
      { status: 500 }
    )
  }
}
