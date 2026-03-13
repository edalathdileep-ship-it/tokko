'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/Button'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { isSignedIn, user } = useUser()
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

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-grotesk font-bold text-black text-sm transition-transform group-hover:scale-105">
            T
          </div>
          <span className="font-grotesk font-bold text-[1.05rem]">Tokko</span>
        </Link>

        {/* Nav links — only show when NOT signed in */}
        {!isSignedIn && (
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'Pricing', 'Docs'].map((item) => (
              <Link key={item} href={`/#${item.toLowerCase().replace(/ /g, '')}`}
                className="font-grotesk font-medium text-[0.88rem] text-text-muted hover:text-text transition-colors">
                {item}
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
                    <Link href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] hover:bg-bg-surface transition-colors">
                      <span className="text-text-muted">⚡</span> Dashboard
                    </Link>
                    <Link href="/dashboard/history"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] hover:bg-bg-surface transition-colors text-text-muted">
                      <span>📋</span> History
                    </Link>
                    <Link href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] hover:bg-bg-surface transition-colors text-text-muted">
                      <span>⚙️</span> Settings
                    </Link>
                    <Link href="/#pricing"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] hover:bg-bg-surface transition-colors">
                      <span className="text-accent">✦</span>
                      <span className="text-accent font-medium">Upgrade to Pro</span>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-border py-1.5">
                    <SignOutButton>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 font-sans text-[0.84rem] text-text-muted hover:bg-bg-surface hover:text-text transition-colors">
                        <span>→</span> Sign out
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
              <Link href="/dashboard/history" className="block font-grotesk font-medium text-text-muted hover:text-text py-1" onClick={() => setMobileOpen(false)}>History</Link>
              <Link href="/#pricing" className="block font-grotesk font-medium text-accent py-1" onClick={() => setMobileOpen(false)}>Upgrade to Pro</Link>
              <SignOutButton>
                <button className="font-grotesk font-medium text-text-muted py-1">Sign out</button>
              </SignOutButton>
            </>
          ) : (
            <>
              {['Features', 'How it works', 'Pricing', 'Docs'].map((item) => (
                <Link key={item} href={`/#${item.toLowerCase().replace(/ /g, '')}`}
                  className="block font-grotesk font-medium text-text-muted hover:text-text py-1"
                  onClick={() => setMobileOpen(false)}>
                  {item}
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