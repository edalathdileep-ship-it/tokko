import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function DELETE() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    // Delete all compressions
    await supabase.from('compressions').delete().eq('user_id', userId)

    // Delete user profile
    await supabase.from('user_profiles').delete().eq('user_id', userId)

    // Delete from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[delete-account]', err)
    return NextResponse.json({ success: false, error: 'Failed to delete account' }, { status: 500 })
  }
}