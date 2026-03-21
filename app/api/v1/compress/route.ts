import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compressWithClaude, mockCompress } from '@/lib/compression'
import { sanitizePrompt, isPromptTooLarge, safeErrorMessage } from '@/lib/security'
import { checkAndIncrementUsage, saveCompression } from '@/lib/rateLimit'
import { createClient } from '@supabase/supabase-js'
import type { CompressionMode, ModelType } from '@/types'

const schema = z.object({
  prompt: z.string().min(1, 'prompt is required').max(200_000, 'prompt exceeds 200k character limit'),
  mode: z.enum(['balanced', 'aggressive', 'smart']).default('balanced'),
  model: z.enum(['claude', 'gpt4', 'gemini']).default('claude'),
})

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Standard error response
function errorResponse(message: string, status: number, code: string) {
  return NextResponse.json(
    { error: { message, code, status } },
    { status, headers: corsHeaders }
  )
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth — Bearer token ───────────────────────────
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(
        'Missing or invalid Authorization header. Use: Bearer tkk_your_token',
        401,
        'auth_required'
      )
    }

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token.startsWith('tkk_')) {
      return errorResponse(
        'Invalid token format. Tokens start with tkk_',
        401,
        'invalid_token'
      )
    }

    // ── 2. Look up token ─────────────────────────────────
    const supabase = getSupabaseAdmin()
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_id, plan, byok_key')
      .eq('api_token', token)
      .single()

    if (!profile) {
      return errorResponse(
        'Invalid API token. Generate a new one at tokko-seven.vercel.app/dashboard/settings',
        401,
        'invalid_token'
      )
    }

    const userId = profile.user_id

    // ── 3. Parse request body ────────────────────────────
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return errorResponse('Request body must be valid JSON', 400, 'invalid_json')
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return errorResponse(
        `${firstError.path.join('.')}: ${firstError.message}`,
        400,
        'validation_error'
      )
    }

    const { prompt: rawPrompt, mode, model } = parsed.data
    const prompt = sanitizePrompt(rawPrompt)

    if (isPromptTooLarge(prompt)) {
      return errorResponse('Prompt exceeds 200,000 character limit', 400, 'prompt_too_large')
    }

    // ── 4. Rate limit ────────────────────────────────────
    const usage = await checkAndIncrementUsage(userId)
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: {
            message: `Daily limit reached (${usage.limit}/day on ${usage.plan} plan)`,
            code: 'rate_limit_exceeded',
            status: 429,
            usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
          },
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'X-RateLimit-Limit': usage.limit.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    // ── 5. Compress ──────────────────────────────────────
    const apiKey = profile.byok_key || process.env.ANTHROPIC_API_KEY
    const result = apiKey
      ? await compressWithClaude(prompt, mode as CompressionMode, model as ModelType, apiKey)
      : mockCompress(prompt, mode as CompressionMode, model as ModelType)

    // ── 6. Save ──────────────────────────────────────────
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
    }).catch(() => {})

    // ── 7. Response ──────────────────────────────────────
    return NextResponse.json(
      {
        compressed: result.compressed,
        usage: {
          original_tokens: result.originalTokens,
          compressed_tokens: result.compressedTokens,
          tokens_saved: result.savedTokens,
          reduction_pct: result.savedPct,
          cost_saved_usd: result.costSaved,
        },
        constraints: result.constraints ? {
          detected: result.constraints.total,
          preserved: result.constraints.passed,
          repaired: result.constraints.repaired,
          warnings: result.constraints.warnings,
        } : null,
        meta: {
          mode: result.mode,
          model: result.model,
          id: result.id,
        },
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'X-RateLimit-Limit': usage.limit.toString(),
          'X-RateLimit-Remaining': Math.max(0, usage.limit - usage.used).toString(),
        },
      }
    )
  } catch (err: any) {
    console.error('[v1/compress]', err)

    const status = err?.status || err?.statusCode || err?.error?.status

    if (status === 529 || status === 503) {
      return errorResponse('Compression service is temporarily overloaded. Retry in a few seconds.', 503, 'service_overloaded')
    }
    if (status === 429) {
      return errorResponse('Too many requests. Please slow down.', 429, 'too_many_requests')
    }

    return errorResponse(safeErrorMessage(err), 500, 'internal_error')
  }
}

// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
