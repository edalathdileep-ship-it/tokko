import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    // Total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Total compressions
    const { count: totalCompressions } = await supabase
      .from('compressions')
      .select('*', { count: 'exact', head: true })

    // Total tokens saved
    const { data: tokenData } = await supabase
      .from('user_profiles')
      .select('total_tokens_saved')

    const totalTokensSaved = tokenData?.reduce((sum, r) => sum + (r.total_tokens_saved || 0), 0) ?? 0

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalCompressions: totalCompressions ?? 0,
      totalTokensSaved,
    }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' }
    })
  } catch {
    return NextResponse.json({ totalUsers: 0, totalCompressions: 0, totalTokensSaved: 0 })
  }
}