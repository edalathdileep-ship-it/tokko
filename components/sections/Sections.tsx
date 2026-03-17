'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button, BtnArrow } from '@/components/ui/Button'

// ── ModelsStrip ───────────────────────────────────────────
export function ModelsStrip() {
  const models = [
    { label: 'Claude', icon: '/model-claude.svg' },
    { label: 'GPT-4o', icon: '/model-chatgpt.svg' },
    { label: 'Gemini Pro', icon: '/model-gemini.svg' },
    { label: 'Claude Code', icon: '/model-claudecode.png' },
    { label: 'Mistral', icon: null, soon: true },
    { label: 'Llama 3', icon: null, soon: true },
  ]
  return (
    <div className="border-y border-border bg-bg-surface/60 py-5">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] flex items-center gap-6 flex-wrap">
        <span className="font-mono text-[0.68rem] text-text-muted whitespace-nowrap">
          Works with every major model →
        </span>
        <div className="flex gap-2 flex-wrap">
          {models.map((m) => (
            <div key={m.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-surface font-grotesk font-medium text-[0.78rem] ${m.soon ? 'opacity-50' : ''}`}>
              {m.icon && (
                <img src={m.icon} alt={m.label} width={16} height={16} className="flex-shrink-0 rounded-sm" />
              )}
              {m.label}
              {m.soon && (
                <span className="font-mono text-[0.55rem] text-text-muted bg-bg-s2 px-1.5 py-px rounded">soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Features ──────────────────────────────────────────────
const FEATURES = [
  { icon: 'compress.svg',       title: 'Prompt Compressor',   desc: 'Paste any prompt and watch it shrink in real time. Three modes: Balanced, Aggressive, Smart. Full control.', tag: 'Core feature' },
  { icon: 'modals.svg',         title: 'Multi-Model Support', desc: 'Switch between Claude, GPT-4, and Gemini from one dashboard. Cost estimates update per model automatically.', tag: 'Differentiator' },
  { icon: 'live-tokens.svg',    title: 'Live Token Counter',  desc: 'See exactly how many tokens your prompt costs before you send it. Updates character by character.', tag: 'Free' },
  { icon: 'analytic-graph.svg', title: 'Analytics Dashboard', desc: 'Track every compression across every model. Tokens saved, cost saved, compression ratios over time.', tag: 'Pro' },
  { icon: 'smart.svg',          title: 'Smart Mode',          desc: 'Powered by Claude itself. Understands context, preserves technical terms and constraints while removing filler.', tag: 'AI-powered' },
  { icon: 'history.svg',        title: 'Compression History', desc: 'Every compression is saved. Go back, restore, compare original vs compressed side by side.', tag: 'Pro' },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-30">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <div className="text-center mb-12 md:mb-18">
          <div className="flex items-center justify-center gap-2.5 font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent mb-4">
            Features
          </div>
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-[-0.035em] leading-none mb-4">
            Everything you need to<br />spend less on tokens.
          </h2>
          <p className="font-sans text-[0.94rem] md:text-[1rem] text-text-muted leading-relaxed max-w-[520px] mx-auto">
            Built for everyone who uses AI every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((f) => (
            <div key={f.title}
              className="bg-bg-card border border-border rounded-3xl p-6 md:p-8 hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-accent/10 border border-accent/20">
                <img src={`/${f.icon}`} alt={f.title} width={22} height={22} style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <h3 className="font-grotesk font-bold text-[0.94rem] tracking-tight mb-2.5">{f.title}</h3>
              <p className="font-sans text-[0.84rem] text-text-muted leading-relaxed">{f.desc}</p>
              <span className="inline-block mt-4 font-mono text-[0.62rem] font-bold px-2.5 py-1 rounded tracking-[0.06em] bg-accent/10 border border-accent/20 text-accent">
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── HowItWorks ────────────────────────────────────────────
const STEPS = [
  { n: '01', title: 'Paste your prompt', desc: 'Drop in any prompt, a question, instruction, or long document. Tokko counts your tokens live as you type.' },
  { n: '02', title: 'Choose your compression mode', desc: 'Pick Balanced (50%), Aggressive (75%), or Smart (AI-powered). Hit compress and done in under 2 seconds.' },
  { n: '03', title: 'Copy and use anywhere', desc: 'Copy the compressed prompt and paste it directly into Claude, ChatGPT, Gemini, or any AI tool.' },
  { n: '04', title: 'Track your savings over time', desc: 'Every compression is tracked. See your running total of tokens saved, money saved, and compression ratios.' },
]

export function HowItWorks() {
  return (
    <section id="howitworks" className="py-20 md:py-30 border-y border-border bg-bg-surface/40">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent mb-4">
              <span className="w-6 h-px bg-accent" /> How it works
            </div>
            <h2 className="font-grotesk font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-none mb-4">
              Three steps.<br />Massive savings.
            </h2>
            <p className="font-sans text-text-muted leading-relaxed mb-10 max-w-[400px]">
              No setup, no integration required. Just paste, compress, and copy.
            </p>

            <div className="space-y-0">
              {STEPS.map((s, i) => (
                <div key={s.n} className={`flex gap-5 py-6 ${i < STEPS.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-bg-s2 border border-border flex items-center justify-center font-mono text-[0.78rem] font-bold text-text-muted flex-shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-grotesk font-bold text-[0.94rem] mb-1.5">{s.title}</div>
                    <div className="font-sans text-[0.82rem] text-text-muted leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini demo — hidden on mobile to save space */}
          <div className="hidden md:block sticky top-24">
            <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-panel">
              <div className="bg-bg-surface px-5 py-3 border-b border-border flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-text-muted">Tokko · Optimizer</span>
                <div className="font-mono text-[0.7rem] text-text bg-bg-s2 border border-border rounded px-2 py-1">
                  Claude
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex gap-2">
                  {['Balanced', 'Aggressive', 'Smart'].map((m, i) => (
                    <div key={m} className={`px-3 py-1.5 rounded-md font-grotesk font-semibold text-[0.72rem] border ${i === 0 ? 'border-accent bg-accent/8 text-accent' : 'border-border bg-bg-s2 text-text-muted'}`}>
                      {m}
                    </div>
                  ))}
                </div>
                <div className="bg-bg-s2 border border-border rounded-lg p-3 font-mono text-[0.72rem] text-text-muted leading-relaxed">
                  Could you please help me write a Python function that filters even numbers...
                </div>
                <div className="w-full py-2.5 bg-accent rounded-lg font-grotesk font-bold text-[0.8rem] text-black text-center flex items-center justify-center gap-2">
                  Compress prompt <img src="/btn-arrow.svg" alt="" width={7} height={12} />
                </div>
                <div className="bg-accent/6 border border-accent/20 rounded-lg p-3 font-mono text-[0.72rem] text-accent leading-relaxed">
                  Python fn: filter even nums list. With examples.
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[0.68rem] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded">−72% tokens</span>
                  <span className="font-mono text-[0.65rem] text-text-muted">saved $0.0002</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── SocialProof ───────────────────────────────────────────
function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function SocialProof() {
  const [stats, setStats] = useState<{ totalUsers: number; totalCompressions: number; totalTokensSaved: number } | null>(null)

  useEffect(() => {
    const fetchStats = () => fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      value: stats ? `${stats.totalUsers}` : '—',
      label: 'Users signed up',
      green: false,
    },
    {
      value: stats ? `${stats.totalCompressions}` : '—',
      label: 'Prompts compressed',
      green: true,
    },
    {
      value: stats ? formatNumber(stats.totalTokensSaved) : '—',
      label: 'Tokens saved',
      green: false,
    },
  ]

  return (
    <section id="proof" className="py-20 md:py-30 border-t border-border">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2.5 font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent mb-4">
            Live stats
          </div>
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tight leading-none mb-4">
            Real numbers. Updated live.
          </h2>
          <p className="font-sans text-[0.94rem] text-text-muted max-w-[480px] mx-auto leading-relaxed">
            We're just getting started. Every number here is real. No fake stats, no inflated counts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {statCards.map((s, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-2xl py-8 px-4 text-center">
              <div className={`font-grotesk font-bold text-[2.4rem] tracking-tight mb-1.5 ${s.green ? 'text-accent' : ''}`}>
                {s.value}
              </div>
              <div className="font-mono text-[0.62rem] text-text-muted tracking-[0.06em] uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="text-center font-mono text-[0.62rem] text-text-muted mt-6">
          Updated every 5 minutes · No fake numbers
        </p>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────
const FAQS = [
  { q: 'How does Tokko compress prompts?', a: 'Tokko removes filler words, redundant phrasing, and unnecessary politeness while preserving the core intent and technical details of your prompt. Smart mode uses AI to understand context before compressing.' },
  { q: 'Will the compressed prompt give the same AI output?', a: 'In most cases yes. AI models are very good at understanding compressed, direct instructions. Balanced mode is the safest (around 50% reduction). Aggressive mode gives bigger savings but works best for simple prompts.' },
  { q: 'Which AI models does Tokko support?', a: 'Currently Claude (Anthropic), GPT-4o (OpenAI), and Gemini Pro (Google). Mistral and Llama support is coming soon.' },
  { q: 'Is the free plan really free?', a: 'Yes, 20 compressions per day, forever. No credit card required to sign up.' },
  { q: 'What is BYOK?', a: 'BYOK means Bring Your Own Key. You connect your existing Anthropic API key to Tokko. We use your key for compressions so you pay Anthropic directly. You pay Tokko just $3/mo for the compression software. Since Tokko cuts your token usage by up to 75%, it pays for itself instantly.' },
  { q: 'What is Smart mode?', a: 'Smart mode uses Claude to understand your prompt before compressing it, preserving technical terms, constraints, and key instructions while removing everything else.' },
  { q: 'Is my data safe?', a: 'Your prompts are not used to train any models. We store your compression history in your dashboard. You can delete it at any time.' },
  { q: 'Is there a Chrome Extension?', a: 'Yes! The Tokko Chrome Extension currently works on Claude.ai. A subtle compress button appears directly in the chat input. ChatGPT and Gemini support is coming soon. Generate your API token from the Settings page to connect it.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 md:py-30 border-t border-border">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2.5 font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent mb-4">
            FAQ
          </div>
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tight leading-none mb-4">
            Questions? We got you.
          </h2>
          <p className="font-sans text-[0.94rem] md:text-[1rem] text-text-muted max-w-[480px] mx-auto">
            Everything you need to know about Tokko. Can't find your answer?{' '}
            <a href="mailto:hello@tokko.app" className="text-accent hover:underline">Email us.</a>
          </p>
        </div>

        <div className="max-w-[720px] mx-auto space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 text-left hover:bg-bg-surface/50 transition-colors"
              >
                <span className="font-grotesk font-bold text-[0.88rem] md:text-[0.94rem] pr-4">{faq.q}</span>
                <span className={`text-accent font-mono text-lg flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 md:px-6 pb-5">
                  <p className="font-sans text-[0.84rem] md:text-[0.88rem] text-text-muted leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTABanner ─────────────────────────────────────────────
export function CTABanner() {
  return (
    <section className="py-20 md:py-24 border-y border-border bg-gradient-to-br from-accent/6 to-accent-purple/6 relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(0,229,160,0.08),transparent)]" />
      <div className="relative max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3.2rem)] tracking-tight leading-none mb-4">
          Ready to stop wasting tokens?
        </h2>
        <p className="font-sans text-[0.94rem] md:text-[1rem] text-text-muted mb-8 md:mb-9">
          Start for free. No credit card. 20 compressions a day, forever.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/auth/signup">
            <Button size="lg">Get started free <BtnArrow /></Button>
          </Link>
          <Link href="/#pricing">
            <Button variant="outline" size="lg">View pricing</Button>
          </Link>
        </div>
        <p className="font-mono text-[0.68rem] text-text-muted mt-4">
          Free forever · No credit card · Upgrade anytime
        </p>
      </div>
    </section>
  )
}