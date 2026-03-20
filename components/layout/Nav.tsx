'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.firstName
    ? user.firstName[0]
    : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '?'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-base/90 backdrop-blur-xl border-b border-border' : ''}`}>
      <nav className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] h-16 flex items-center justify-between">

        {/* Logo — wordmark only */}
        <Link href="/" className="flex items-center group">
          <img src="/tokko_logo.svg" alt="Tokko" width={80} height={20} className="transition-opacity group-hover:opacity-80" />
        </Link>

        {/* Nav links — only show when NOT signed in */}
        {!isSignedIn && (
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '/#features' },
              { label: 'How it works', href: '/#howitworks' },
              { label: 'Pricing', href: '/#pricing' },
              { label: 'API Docs', href: '/docs' },
            ].map((item) => (
              <Link key={item.label} href={item.href}
                className="font-grotesk font-medium text-[0.88rem] text-text-muted hover:text-text transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border bg-bg-card hover:border-accent/30 transition-all"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center font-grotesk font-bold text-black text-[0.72rem]">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="avatar" className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="text-left">
                  <div className="font-grotesk font-bold text-[0.82rem] leading-none">
                    {user?.firstName ?? 'Account'}
                  </div>
                  <div className="font-mono text-[0.6rem] text-text-muted mt-0.5">Free plan</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-border rounded-2xl overflow-hidden shadow-panel z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="font-grotesk font-bold text-[0.88rem]">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="font-mono text-[0.65rem] text-text-muted mt-0.5">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    {[
                      { href: '/dashboard', label: 'Dashboard', icon: '/icon-dashboard.svg', exact: true },
                      { href: '/dashboard/playground', label: 'Playground', icon: '/smart.svg', exact: false },
                      { href: '/dashboard/prompts', label: 'Saved Prompts', icon: '/compress.svg', exact: false },
                      { href: '/dashboard/history', label: 'History', icon: '/icon-history.svg', exact: false },
                      { href: '/dashboard/analytics', label: 'Analytics', icon: '/analytic-graph.svg', exact: false },
                      { href: '/dashboard/settings', label: 'Settings', icon: '/icon-settings.svg', exact: false },
                    ].map((item) => {
                      const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                      return (
                        <Link key={item.href} href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] transition-colors hover:bg-bg-surface ${
                            isActive ? 'text-text bg-bg-surface' : 'text-text-muted hover:text-text'
                          }`}>
                          <img src={item.icon} width={16} height={16} alt="" />
                          {item.label}
                        </Link>
                      )
                    })}
                    <Link href="/#pricing"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] hover:bg-bg-surface transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span className="text-accent font-medium">Upgrade to Pro</span>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-border py-1.5">
                    <SignOutButton>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] text-text hover:bg-bg-surface transition-colors">
                        <img src="/icon-signout.svg" width={16} height={16} alt="" />
                        Sign out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className="font-grotesk font-medium text-[0.88rem] text-text-muted hover:text-text transition-colors">
                  Log in
                </button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get started free →</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-text-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current" />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-base border-b border-border px-6 py-4 space-y-3">
          {isSignedIn ? (
            <>
              {/* User info on mobile */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-grotesk font-bold text-black text-[0.82rem]">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="avatar" className="w-9 h-9 rounded-xl object-cover" />
                  ) : initials}
                </div>
                <div>
                  <div className="font-grotesk font-bold text-[0.88rem]">{user?.firstName} {user?.lastName}</div>
                  <div className="font-mono text-[0.62rem] text-text-muted">{user?.emailAddresses?.[0]?.emailAddress}</div>
                </div>
              </div>
              <Link href="/dashboard" className="block font-grotesk font-medium text-text-muted hover:text-text py-1" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link href="/dashboard/playground" className="block font-grotesk font-medium text-text-muted hover:text-text py-1" onClick={() => setMobileOpen(false)}>Playground</Link>
              <Link href="/dashboard/prompts" className="block font-grotesk font-medium text-text-muted hover:text-text py-1" onClick={() => setMobileOpen(false)}>Saved Prompts</Link>
              <Link href="/dashboard/history" className="block font-grotesk font-medium text-text-muted hover:text-text py-1" onClick={() => setMobileOpen(false)}>History</Link>
              <Link href="/dashboard/analytics" className="block font-grotesk font-medium text-text-muted hover:text-text py-1" onClick={() => setMobileOpen(false)}>Analytics</Link>
              <Link href="/dashboard/settings" className="block font-grotesk font-medium text-text-muted hover:text-text py-1" onClick={() => setMobileOpen(false)}>Settings</Link>
              <Link href="/#pricing" className="block font-grotesk font-medium text-accent py-1" onClick={() => setMobileOpen(false)}>Upgrade to Pro</Link>
              <SignOutButton>
                <button className="font-grotesk font-medium text-text-muted py-1">Sign out</button>
              </SignOutButton>
            </>
          ) : (
            <>
              {[
                { label: 'Features', href: '/#features' },
                { label: 'How it works', href: '/#howitworks' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'API Docs', href: '/docs' },
              ].map((item) => (
                <Link key={item.label} href={item.href}
                  className="block font-grotesk font-medium text-text-muted hover:text-text py-1"
                  onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/auth/signin"><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
                <Link href="/auth/signup"><Button size="sm" className="w-full">Get started free →</Button></Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  )
}