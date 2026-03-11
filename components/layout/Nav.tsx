'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/Button'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-base/90 backdrop-blur-xl border-b border-border' : ''}`}>
      <nav className="max-w-content mx-auto px-[48px] h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-grotesk font-bold text-black text-sm transition-transform group-hover:scale-105">
            T
          </div>
          <span className="font-grotesk font-bold text-[1.05rem]">Tokko</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing', 'Docs'].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase().replace(/ /g, '')}`}
              className="font-grotesk font-medium text-[0.88rem] text-text-muted hover:text-text transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <SignOutButton>
                <button className="font-grotesk font-medium text-[0.88rem] text-text-muted hover:text-text transition-colors">
                  Sign out
                </button>
              </SignOutButton>
            </>
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
        <div className="md:hidden bg-bg-base border-b border-border px-[48px] py-4 space-y-3">
          {['Features', 'How it works', 'Pricing', 'Docs'].map((item) => (
            <Link key={item} href={`/#${item.toLowerCase().replace(/ /g, '')}`}
              className="block font-grotesk font-medium text-text-muted hover:text-text py-1"
              onClick={() => setMobileOpen(false)}>
              {item}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {isSignedIn ? (
              <>
                <Link href="/dashboard"><Button size="sm" className="w-full">Dashboard</Button></Link>
                <SignOutButton><button className="text-text-muted text-sm">Sign out</button></SignOutButton>
              </>
            ) : (
              <>
                <Link href="/auth/signin"><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
                <Link href="/auth/signup"><Button size="sm" className="w-full">Get started free →</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
