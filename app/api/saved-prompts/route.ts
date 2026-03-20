import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET — list saved prompts
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('saved_prompts')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[saved-prompts GET]', error)
    return NextResponse.json({ success: false, error: 'Failed to load saved prompts' }, { status: 500 })
  }

  return NextResponse.json({ success: true, prompts: data ?? [] })
}

const saveSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  original_text: z.string().min(1),
  compressed_text: z.string().min(1),
  original_tokens: z.number().int().min(0),
  compressed_tokens: z.number().int().min(0),
  saved_pct: z.number().int().min(0).max(100),
  mode: z.string(),
})

// POST — save a compressed prompt
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = saveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0].message },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  // Check limit — max 20 saved prompts on free plan
  const { count } = await supabase
    .from('saved_prompts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if ((count ?? 0) >= 20) {
    return NextResponse.json(
      { success: false, error: 'You can save up to 20 prompts. Delete some to make room.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('saved_prompts')
    .insert({
      user_id: userId,
      ...parsed.data,
    })
    .select()
    .single()

  if (error) {
    console.error('[saved-prompts POST]', error)
    return NextResponse.json({ success: false, error: 'Failed to save prompt' }, { status: 500 })
  }

  return NextResponse.json({ success: true, prompt: data })
}

// DELETE — remove a saved prompt
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('saved_prompts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('[saved-prompts DELETE]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
