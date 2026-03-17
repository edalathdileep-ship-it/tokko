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
    desc: 'Try it out. No credit card required.',
    cta: 'Get started free',
    ctaVariant: 'outline' as const,
    badge: null,
    features: [
      { label: '20 compressions per day',        yes: true },
      { label: 'All 3 compression modes',        yes: true },
      { label: 'Live token counter',             yes: true },
      { label: 'Compression history',            yes: true },
      { label: 'Chrome Extension access',        yes: true },
      { label: 'Unlimited compressions',         yes: false },
      { label: 'BYOK — your own API key',        yes: false },
      { label: 'Priority support',               yes: false },
    ],
  },
  {
    id: 'byok',
    name: 'BYOK',
    monthly: 3,
    annual: 2,
    desc: 'Bring your own Anthropic key. Pay only for the Tokko service.',
    cta: 'Coming soon',
    ctaVariant: 'outline' as const,
    badge: 'BEST VALUE',
    features: [
      { label: 'Unlimited compressions',         yes: true },
      { label: 'All 3 compression modes',        yes: true },
      { label: 'Your own Anthropic API key',     yes: true },
      { label: 'Compression history',            yes: true },
      { label: 'Chrome Extension access',        yes: true },
      { label: 'Email support',                  yes: true },
      { label: 'Multi-model support',            yes: false },
      { label: 'API access',                     yes: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 9,
    annual: 7,
    desc: 'We handle everything. Just compress and save.',
    cta: 'Coming soon',
    ctaVariant: 'primary' as const,
    badge: 'COMING SOON',
    featured: true,
    features: [
      { label: 'Unlimited compressions',         yes: true },
      { label: 'All 3 compression modes',        yes: true },
      { label: 'We cover your API costs',        yes: true },
      { label: 'Compression history',            yes: true },
      { label: 'Chrome Extension access',        yes: true },
      { label: 'Priority support',               yes: true },
      { label: 'Multi-model support',            yes: false },
      { label: 'API access',                     yes: false },
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

          {/* BYOK callout */}
          <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-xl px-4 py-2.5 mb-7">
            <span className="font-sans text-[0.82rem] text-text-muted">
              Already have an Anthropic API key? Use <span className="text-accent font-medium">BYOK</span> and pay just <span className="text-text font-medium">$3/mo</span> for Tokko
            </span>
          </div>

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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-15">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative rounded-3xl md:rounded-4xl p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 ${
              plan.featured
                ? 'border border-accent bg-accent/3'
                : 'border border-border bg-bg-card hover:border-accent/30'
            }`}>
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 font-mono font-bold text-[0.6rem] tracking-[0.12em] px-3.5 py-1 rounded-full whitespace-nowrap ${
                  plan.featured
                    ? 'bg-accent text-black'
                    : 'bg-bg-s2 border border-border text-text-muted'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="font-mono text-[0.65rem] font-bold tracking-[0.14em] uppercase text-text-muted mb-3.5">
                {plan.name}
              </div>
              <div className="font-grotesk font-bold text-[2.8rem] md:text-[3.2rem] tracking-[-0.05em] leading-none mb-1">
                ${annual ? plan.annual : plan.monthly}
                <span className="text-[0.9rem] font-normal font-sans text-text-muted"> / month</span>
              </div>
              {plan.id === 'byok' && (
                <div className="font-mono text-[0.65rem] text-accent mt-1">
                  + your Anthropic API costs
                </div>
              )}
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

        {/* BYOK explanation */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 max-w-2xl mx-auto text-center">
          <div className="font-grotesk font-bold text-[0.94rem] mb-2">What is BYOK?</div>
          <p className="font-sans text-[0.82rem] text-text-muted leading-relaxed">
            <span className="text-text">Bring Your Own Key</span> means you connect your existing Anthropic API key to Tokko.
            We use your key for compressions. You pay Anthropic directly at their rates.
            You pay Tokko just <span className="text-accent font-medium">$3/mo</span> for the compression software.
            If compression saves you 50% on tokens, your Anthropic bill drops. Tokko pays for itself instantly.
          </p>
        </div>

      </div>
    </section>
  )
}
