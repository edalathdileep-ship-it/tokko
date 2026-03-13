import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { getCompressionHistory } from '@/lib/rateLimit'
import { HistoryClient } from '@/components/history/HistoryClient'

export default async function HistoryPage() {
  const user = await currentUser()
  if (!user) redirect('/auth/signin')

  const history = await getCompressionHistory(user.id).catch(() => [])

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] pt-28 pb-20">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-1">
              History
            </h1>
            <p className="text-text-muted font-sans text-[0.95rem]">
              Your past compressions
            </p>
          </div>
          <a
            href="/dashboard"
            className="font-grotesk font-medium text-[0.88rem] text-text-muted hover:text-text transition-colors"
          >
            ← Back to dashboard
          </a>
        </div>

        <HistoryClient history={history} />

      </main>
    </div>
  )
}