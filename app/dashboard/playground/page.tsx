import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { PlaygroundClient } from '@/components/playground/PlaygroundClient'

export default async function PlaygroundPage() {
  const user = await currentUser()
  if (!user) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] pt-28 pb-20">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-1">
              Playground
            </h1>
            <p className="text-text-muted font-sans text-[0.95rem]">
              Compare outputs side by side. See if compression changes anything.
            </p>
          </div>
          <a
            href="/dashboard"
            className="font-grotesk font-medium text-[0.88rem] text-text-muted hover:text-text transition-colors"
          >
            ← Back to dashboard
          </a>
        </div>

        <PlaygroundClient />

      </main>
    </div>
  )
}
