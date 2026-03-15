import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET — check if user has a BYOK key
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ hasKey: false }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('user_profiles')
    .select('byok_key')
    .eq('user_id', userId)
    .single()

  const hasKey = !!data?.byok_key
  const masked = hasKey ? `sk-ant-...${data.byok_key.slice(-6)}` : null

  return NextResponse.json({ hasKey, masked })
}

// POST — save BYOK key
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { key } = await req.json()

  if (!key?.trim()) {
    return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 })
  }

  // Validate it looks like an Anthropic key
  if (!key.trim().startsWith('sk-ant-')) {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid key — Anthropic keys start with sk-ant-' 
    }, { status: 400 })
  }

  // Quick validation — test the key works
  try {
    const testRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'hi' }],
      }),
    })

    if (testRes.status === 401) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid API key — authentication failed' 
      }, { status: 400 })
    }
  } catch {
    // If test fails due to network, still save — don't block user
  }

  const supabase = getSupabaseAdmin()

  // Upsert user profile with BYOK key
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      byok_key: key.trim(),
      plan: 'byok',
    }, { onConflict: 'user_id' })

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to save key' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETE — remove BYOK key
export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false }, { status: 401 })

  const supabase = getSupabaseAdmin()
  await supabase
    .from('user_profiles')
    .update({ byok_key: null, plan: 'free' })
    .eq('user_id', userId)

  return NextResponse.json({ success: true })
}