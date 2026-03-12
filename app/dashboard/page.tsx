import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Optimizer } from '@/components/optimizer/Optimizer'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/auth/signin')

  const firstName = user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] pt-28 pb-20">

        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-1">
            Hey, {firstName} 👋
          </h1>
          <p className="text-text-muted font-sans text-[0.95rem]">
            Ready to compress some prompts?
          </p>
        </div>

        {/* Stats row — same max-width as optimizer */}
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tokens saved', value: '—', accent: true },
            { label: 'Compressions',  value: '—' },
            { label: 'Avg reduction', value: '—' },
            { label: 'Cost saved',    value: '—' },
          ].map((s) => (
            <div key={s.label} className="bg-bg-card border border-border rounded-2xl p-5">
              <div className={`font-grotesk font-bold text-[1.6rem] tracking-tight mb-1.5 ${s.accent ? 'text-accent' : ''}`}>
                {s.value}
              </div>
              <div className="font-mono text-[0.62rem] text-text-muted tracking-[0.08em] uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="max-w-3xl mx-auto border-t border-border mb-8" />

        {/* Optimizer */}
        <Optimizer />

      </main>
    </div>
  )
}