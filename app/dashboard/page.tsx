import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Optimizer } from '@/components/optimizer/Optimizer'

export default async function DashboardPage() {
  const user = await currentUser()

  // Should never reach here due to middleware, but just in case
  if (!user) redirect('/auth/signin')

  const firstName = user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-content mx-auto px-[48px] py-12 pt-28">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-1">
            Hey, {firstName} 👋
          </h1>
          <p className="text-text-muted font-sans text-[0.95rem]">
            Ready to compress some prompts?
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Tokens saved', value: '—', accent: true },
            { label: 'Compressions', value: '—' },
            { label: 'Avg reduction', value: '—' },
            { label: 'Cost saved', value: '—' },
          ].map((s) => (
            <div key={s.label} className="bg-bg-card border border-border rounded-2xl p-5">
              <div className={`font-grotesk font-bold text-[1.8rem] tracking-tight mb-1 ${s.accent ? 'text-accent' : ''}`}>
                {s.value}
              </div>
              <div className="font-mono text-[0.65rem] text-text-muted tracking-[0.06em] uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Optimizer */}
        <Optimizer />

      </main>
    </div>
  )
}
