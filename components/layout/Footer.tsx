import Link from 'next/link'

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Features',          href: '/#features' },
      { label: 'How it works',      href: '/#howitworks' },
      { label: 'Pricing',           href: '/#pricing' },
      { label: 'FAQ',               href: '/#faq' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Web App',           href: '/dashboard' },
      { label: 'Chrome Extension',  href: '/#extension' },
      { label: 'ChatGPT Extension', href: '#', soon: true },
      { label: 'Gemini Extension',  href: '#', soon: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',    href: '/privacy' },
      { label: 'Terms of Service',  href: '/terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-border">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] pt-14 pb-8">

        {/* Main grid — stacks on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 mb-12">

          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center mb-3.5">
              <img src="/tokko_logo.svg" alt="Tokko" width={72} height={18} />
            </Link>
            <p className="font-sans text-[0.82rem] text-text-muted leading-relaxed max-w-[240px] mb-5">
              The token optimizer for developers and teams who use AI every day.
            </p>
            <p className="font-mono text-[0.68rem] text-text-muted">
              © 2026 Tokko. All rights reserved.
            </p>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <div className="font-grotesk font-bold text-[0.82rem] mb-4">{col.title}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href}
                    className="flex items-center gap-2 font-sans text-[0.82rem] text-text-muted hover:text-text transition-colors">
                    {l.label}
                    {'soon' in l && l.soon && (
                      <span className="font-mono text-[0.55rem] font-bold text-text-muted bg-bg-s2 border border-border px-1.5 py-px rounded">
                        soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-7 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[0.68rem] text-text-muted">
            Built for AI power users
          </p>
          <p className="font-mono text-[0.68rem] text-text-muted">
            @tokko 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}