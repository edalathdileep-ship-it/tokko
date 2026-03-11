import Link from 'next/link'

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Features',    href: '/#features' },
      { label: 'How it works',href: '/#howitworks' },
      { label: 'Pricing',     href: '/#pricing' },
      { label: 'FAQ',         href: '/#faq' },
    ],
  },
  {
    title: 'Coming Soon',
    links: [
      { label: 'Chrome Extension', href: '#', soon: true },
      { label: 'REST API',         href: '#', soon: true },
      { label: 'JavaScript SDK',   href: '#', soon: true },
      { label: 'Python SDK',       href: '#', soon: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',   href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-border">
      <div className="max-w-content mx-auto px-[48px] pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-5 gap-12 mb-14">

          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-grotesk font-bold text-[1.05rem] tracking-tight mb-3.5">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[0.65rem] font-extrabold text-black">
                T
              </div>
              Tokko
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
        <div className="pt-7 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <p className="font-mono text-[0.68rem] text-text-muted">
            Built with ❤️ for AI power users
          </p>
          <div className="flex items-center gap-1.5 font-mono text-[0.68rem] text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}