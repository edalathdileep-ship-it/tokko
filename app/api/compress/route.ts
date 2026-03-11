import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compressWithClaude, mockCompress } from '@/lib/compression'

const schema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(50000, 'Prompt too long'),
  mode:   z.enum(['balanced', 'aggressive', 'smart']),
  model:  z.enum(['claude', 'gpt4', 'gemini']),
  apiKey: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { prompt, mode, model, apiKey } = parsed.data

    // Use real API if key provided, otherwise mock
    const result = apiKey
      ? await compressWithClaude(prompt, mode, model, apiKey)
      : mockCompress(prompt, mode, model)

    return NextResponse.json({ success: true, data: result })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Compression failed'

    // Surface API auth errors clearly
    if (message.includes('auth') || message.includes('401') || message.includes('API key')) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key. Please check your settings.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
