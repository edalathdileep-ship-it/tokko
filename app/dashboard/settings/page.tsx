import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { SettingsClient } from '@/components/settings/SettingsClient'

export default async function SettingsPage() {
  const user = await currentUser()
  if (!user) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-[760px] mx-auto px-4 sm:px-8 md:px-[48px] pt-28 pb-24">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-1">
            Settings
          </h1>
          <p className="font-sans text-text-muted text-[0.95rem]">
            Manage your account and preferences.
          </p>
        </div>

        <SettingsClient
          userId={user.id}
          firstName={user.firstName ?? ''}
          lastName={user.lastName ?? ''}
          email={user.emailAddresses[0]?.emailAddress ?? ''}
          imageUrl={user.imageUrl ?? ''}
          createdAt={user.createdAt}
        />
      </main>
    </div>
  )
}