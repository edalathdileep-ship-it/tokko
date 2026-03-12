import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { compressWithClaude, mockCompress } from '@/lib/compression'

const schema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(50000, 'Prompt too long'),
  mode:   z.enum(['balanced', 'aggressive', 'smart']),
  model:  z.enum(['claude', 'gpt4', 'gemini']),
})

export async function POST(req: NextRequest) {
  try {
    // Must be logged in
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to compress prompts' },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Guard against null/undefined prompt
    if (!body?.prompt || typeof body.prompt !== 'string' || !body.prompt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a prompt first' },
        { status: 400 }
      )
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { prompt, mode, model } = parsed.data

    // Use server-side API key — never expose to browser
    const apiKey = process.env.ANTHROPIC_API_KEY

    const result = apiKey
      ? await compressWithClaude(prompt, mode, model, apiKey)
      : mockCompress(prompt, mode, model)

    return NextResponse.json({ success: true, data: result })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Compression failed'

    if (message.includes('auth') || message.includes('401') || message.includes('API key')) {
      return NextResponse.json(
        { success: false, error: 'API configuration error. Please contact support.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}