'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Check, Minus } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    annual: 0,
    desc: 'Try before you commit. No credit card required.',
    cta: 'Get started free',
    ctaVariant: 'outline' as const,
    features: [
      { label: '50 compressions per day',      yes: true },
      { label: 'Balanced mode',                yes: true },
      { label: 'Claude support',               yes: true },
      { label: 'Live token counter',           yes: true },
      { label: 'Multi-model support',          yes: false },
      { label: 'Analytics dashboard',          yes: false },
      { label: 'Compression history',          yes: false },
      { label: 'API access',                   yes: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 9,
    annual: 7,
    desc: 'For power users, developers, and solo builders.',
    cta: 'Start 7-day free trial →',
    ctaVariant: 'primary' as const,
    featured: true,
    features: [
      { label: 'Unlimited compressions',       yes: true },
      { label: 'All 3 compression modes',      yes: true },
      { label: 'Claude + GPT-4 + Gemini',      yes: true },
      { label: 'Full analytics dashboard',     yes: true },
      { label: 'Compression history & export', yes: true },
      { label: 'API access',                   yes: true },
      { label: 'Conversation summarizer',      yes: true },
      { label: 'Team seats',                   yes: false },
    ],
  },
  {
    id: 'teams',
    name: 'Teams',
    monthly: 29,
    annual: 23,
    desc: 'For teams using AI at scale across projects.',
    cta: 'Contact sales →',
    ctaVariant: 'outline' as const,
    features: [
      { label: 'Everything in Pro',            yes: true },
      { label: 'Up to 10 team seats',          yes: true },
      { label: 'Team analytics & reporting',   yes: true },
      { label: 'Per-user breakdown',           yes: true },
      { label: 'Claude Code integration',      yes: true },
      { label: 'Custom compression rules',     yes: true },
      { label: 'Slack bot',                    yes: true },
      { label: 'Priority support',             yes: true },
    ],
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="py-20 md:py-30 border-t border-border">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">

        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2.5 font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent mb-4">
            Pricing
          </div>
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tight leading-none mb-3">
            Start free. Scale when ready.
          </h2>
          <p className="font-sans text-text-muted mb-7">
            No hidden fees. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3.5">
            <span className="font-mono text-[0.78rem] text-text-muted">Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-[46px] h-[26px] rounded-full transition-colors ${annual ? 'bg-accent' : 'bg-bg-s2 border border-border'}`}
            >
              <div className={`absolute top-1 w-[18px] h-[18px] rounded-full transition-all ${annual ? 'right-1 bg-black' : 'left-1 bg-text-muted'}`} />
            </button>
            <span className="font-mono text-[0.78rem] text-text-muted">Annual</span>
            <span className="font-mono text-[0.65rem] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
              Save 20%
            </span>
          </div>
        </div>

        {/* Cards — stack on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-15">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative rounded-3xl md:rounded-4xl p-6 md:p-8 transition-transform hover:-translate-y-1 ${
              plan.featured
                ? 'border border-accent bg-accent/3'
                : 'border border-border bg-bg-card'
            }`}>
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-black font-mono font-bold text-[0.6rem] tracking-[0.12em] px-3.5 py-1 rounded-full whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              <div className="font-mono text-[0.65rem] font-bold tracking-[0.14em] uppercase text-text-muted mb-3.5">
                {plan.name}
              </div>
              <div className="font-grotesk font-bold text-[2.8rem] md:text-[3.2rem] tracking-[-0.05em] leading-none mb-1">
                ${annual ? plan.annual : plan.monthly}
                <span className="text-[0.9rem] font-normal font-sans text-text-muted"> / month</span>
              </div>
              <p className="font-sans text-[0.8rem] text-text-muted mt-2.5 mb-6 leading-snug">{plan.desc}</p>
              <div className="h-px bg-border mb-6" />

              <div className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <div key={f.label} className="flex items-start gap-2.5 font-sans text-[0.83rem]">
                    <div className={`w-[17px] h-[17px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      f.yes
                        ? 'bg-accent/12 border border-accent/25 text-accent'
                        : 'bg-bg-s2 border border-border text-text-muted'
                    }`}>
                      {f.yes ? <Check size={10} strokeWidth={3} /> : <Minus size={10} />}
                    </div>
                    <span className={f.yes ? '' : 'text-text-muted'}>{f.label}</span>
                  </div>
                ))}
              </div>

              <Link href={plan.id === 'teams' ? '/contact' : '/auth/signup'}>
                <Button variant={plan.ctaVariant} className="w-full justify-center">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}