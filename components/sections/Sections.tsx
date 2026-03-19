'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

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
  { icon: 'compress.svg',       title: 'Cut tokens in seconds',     desc: 'Paste your prompt, pick a mode, hit compress. Three levels (Balanced, Aggressive, Smart) so you control how far it goes.', tag: 'Core' },
  { icon: 'modals.svg',         title: 'One tool, every model',     desc: 'Claude, GPT-4, Gemini. Switch models without switching tools. Cost estimates adjust automatically per model.', tag: 'Multi-model' },
  { icon: 'live-tokens.svg',    title: 'Know before you send',      desc: 'A live token counter shows exactly what your prompt costs before it hits the API. No more guessing, no more surprises.', tag: 'Free' },
  { icon: 'analytic-graph.svg', title: 'See where your money goes', desc: 'Charts, trends, breakdowns. Track tokens saved, cost saved, and compression ratios across every prompt you compress.', tag: 'Analytics' },
  { icon: 'smart.svg',          title: 'AI that rewrites AI',       desc: 'Smart mode uses Claude to understand what your prompt means before compressing it. Technical terms, constraints, and intent stay intact.', tag: 'AI-powered' },
  { icon: 'history.svg',        title: 'Never lose a prompt',       desc: 'Full history of every compression. Compare original vs compressed side by side. Copy any version with one click.', tag: 'Built-in' },
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
            Less fluff. Lower bills.<br />Same results.
          </h2>
          <p className="font-sans text-[0.94rem] md:text-[1rem] text-text-muted leading-relaxed max-w-[520px] mx-auto">
            Everything you need to compress prompts, track savings, and stop overpaying for AI.
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

// ── WhoItsFor ─────────────────────────────────────────────
const PERSONAS = [
  {
    role: 'Freelancers and consultants',
    pain: 'You use Claude or ChatGPT dozens of times a day for clients. Every token adds up across projects.',
    result: 'Cut your monthly AI bill by half without changing how you work.',
  },
  {
    role: 'Developers using AI APIs',
    pain: 'Your app sends hundreds of API calls daily. Prompt size directly impacts your infrastructure costs.',
    result: 'Compress system prompts and instructions before they hit the API. Ship the same features, pay less.',
  },
  {
    role: 'Content creators and writers',
    pain: 'Long creative briefs and editing instructions eat through your token budget fast.',
    result: 'Send the same detailed briefs at a fraction of the token cost. Your output stays the same.',
  },
  {
    role: 'Teams with AI subscriptions',
    pain: 'Your team runs through usage limits by Wednesday. Upgrading plans costs more than you budgeted.',
    result: 'Every team member compresses before sending. Same productivity, significantly fewer tokens.',
  },
  {
    role: 'Students and researchers',
    pain: 'On a free plan or tight budget. Every wasted token means fewer questions you can ask.',
    result: 'Get 2-3x more prompts from the same plan. No upgrade needed.',
  },
  {
    role: 'Anyone with an AI bill',
    pain: 'You see the charges each month and wonder if you really need to be paying that much.',
    result: 'You don\'t. Most of what you\'re paying for is filler your AI doesn\'t need.',
  },
]

export function WhoItsFor() {
  return (
    <section className="py-20 md:py-30 border-t border-border">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <div className="text-center mb-12 md:mb-18">
          <div className="flex items-center justify-center gap-2.5 font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent mb-4">
            Who it&apos;s for
          </div>
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-[-0.035em] leading-none mb-4">
            If you use AI, you&apos;re overpaying.
          </h2>
          <p className="font-sans text-[0.94rem] md:text-[1rem] text-text-muted leading-relaxed max-w-[520px] mx-auto">
            Tokko works for anyone who sends prompts, whether it&apos;s 5 a day or 5,000.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {PERSONAS.map((p) => (
            <div key={p.role}
              className="bg-bg-card border border-border rounded-3xl p-6 md:p-8 hover:border-accent/30 transition-all duration-200 flex flex-col">
              <div className="font-grotesk font-bold text-[0.94rem] tracking-tight mb-3">{p.role}</div>
              <p className="font-sans text-[0.82rem] text-text-muted leading-relaxed mb-4 flex-1">{p.pain}</p>
              <div className="border-t border-border pt-4">
                <p className="font-sans text-[0.82rem] text-accent leading-relaxed">{p.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── HowItWorks ────────────────────────────────────────────
const STEPS = [
  { n: '01', title: 'Paste your prompt', desc: 'Any prompt, any length. A question, a system instruction, a 4,000-word brief. Tokko shows you the token count as you type.' },
  { n: '02', title: 'Pick how hard to compress', desc: 'Balanced keeps full meaning at ~50% off. Aggressive strips everything to keywords at ~75% off. Smart uses AI to decide what stays.' },
  { n: '03', title: 'Copy and send', desc: 'One click to copy the compressed version. Paste it into Claude, ChatGPT, Gemini, or any AI tool. The output stays the same. The bill does not.' },
  { n: '04', title: 'Watch your savings add up', desc: 'Every compression is tracked. Your dashboard shows the total tokens saved, dollars saved, and how your usage trends over time.' },
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
              Paste. Compress. Save.<br />That&apos;s it.
            </h2>
            <p className="font-sans text-text-muted leading-relaxed mb-10 max-w-[400px]">
              No API keys to configure. No plugins to install. Works in your browser, right now.
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

          {/* Animated Optimizer Demo */}
          <div className="md:sticky md:top-24">
            <AnimatedOptimizer />
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedOptimizer() {
  const inputRef = useRef<HTMLSpanElement>(null)
  const outputRef = useRef<HTMLSpanElement>(null)
  const cur2Ref = useRef<HTMLSpanElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const outputWrapRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const costRef = useRef<HTMLSpanElement>(null)
  const tabRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

  const MODES = [
    { output: 'Python fn: filter even nums from list.', tokens: '-52%', cost: 'saved $0.0002' },
    { output: 'Python: filter evens.', tokens: '-74%', cost: 'saved $0.0004' },
    { output: 'Python function: filter even numbers. Include type hints + examples.', tokens: '-41%', cost: 'saved $0.0001' },
  ]
  const INPUT = "Could you please help me write a Python function that filters even numbers from a list?"

  useEffect(() => {
    let cancelled = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    function setTab(i: number) {
      tabRefs.forEach((ref, j) => {
        if (!ref.current) return
        if (j === i) {
          ref.current.style.borderColor = '#00e5a0'
          ref.current.style.background = 'rgba(0,229,160,0.1)'
          ref.current.style.color = '#00e5a0'
        } else {
          ref.current.style.borderColor = 'var(--border)'
          ref.current.style.background = 'transparent'
          ref.current.style.color = 'var(--text-muted)'
        }
      })
    }

    async function typeText(el: HTMLSpanElement, text: string, speed = 22) {
      el.textContent = ''
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return
        el.textContent = text.slice(0, i + 1)
        await sleep(speed + Math.random() * 10)
      }
    }

    async function typeOutput(el: HTMLSpanElement, cur: HTMLSpanElement, text: string, speed = 26) {
      cur.style.display = 'inline-block'
      el.textContent = ''
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return
        el.textContent = text.slice(0, i + 1)
        await sleep(speed + Math.random() * 12)
      }
      cur.style.display = 'none'
    }

    async function compress(modeIdx: number) {
      const progressBar = progressBarRef.current
      const outputWrap = outputWrapRef.current
      const outputEl = outputRef.current
      const cur2 = cur2Ref.current
      const badge = badgeRef.current
      const cost = costRef.current
      if (!progressBar || !outputWrap || !outputEl || !cur2 || !badge || !cost) return

      const m = MODES[modeIdx]
      outputWrap.style.opacity = '0'
      outputEl.textContent = ''
      await sleep(200)

      progressBar.style.transition = 'none'
      progressBar.style.width = '0%'
      await sleep(30)
      progressBar.style.transition = 'width 1.3s ease-in-out'
      progressBar.style.width = '100%'
      await sleep(1400)
      progressBar.style.transition = 'none'
      progressBar.style.width = '0%'
      await sleep(100)

      outputWrap.style.opacity = '1'
      badge.textContent = m.tokens + ' tokens saved'
      cost.textContent = m.cost
      await typeOutput(outputEl, cur2, m.output, 24)
    }

    async function run() {
      const inputEl = inputRef.current
      const outputWrap = outputWrapRef.current
      if (!inputEl || !outputWrap) return

      while (!cancelled) {
        inputEl.textContent = ''
        outputWrap.style.opacity = '0'
        setTab(0)
        await sleep(600)

        await typeText(inputEl, INPUT, 20)
        if (cancelled) return
        await sleep(600)

        for (let i = 0; i < 3; i++) {
          if (cancelled) return
          setTab(i)
          await sleep(400)
          await compress(i)
          await sleep(2000)
        }
        await sleep(500)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-panel">
      <div className="bg-bg-surface px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[0.68rem] text-text-muted">Tokko · Optimizer</span>
        <div className="font-mono text-[0.7rem] text-text bg-bg-s2 border border-border rounded px-2 py-1">Claude</div>
      </div>
      <div className="p-5 space-y-3">
        {/* Tabs */}
        <div className="flex gap-2">
          {['Balanced', 'Aggressive', 'Smart'].map((m, i) => (
            <div key={m} ref={tabRefs[i]}
              className="px-3 py-1.5 rounded-md font-grotesk font-semibold text-[0.72rem] border transition-all duration-250"
              style={{ borderColor: i === 0 ? 'var(--accent)' : 'var(--border)', background: i === 0 ? 'rgba(0,229,160,0.1)' : 'transparent', color: i === 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
              {m}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-bg-s2 border border-border rounded-lg p-3 font-mono text-[0.72rem] text-text-muted leading-relaxed min-h-[56px]">
          <span ref={inputRef} />
        </div>

        {/* Compress button */}
        <div className="w-full py-2.5 bg-accent rounded-lg font-grotesk font-bold text-[0.8rem] text-black text-center relative overflow-hidden">
          Compress prompt
          <div ref={progressBarRef} className="absolute left-0 top-0 h-full bg-black/10 pointer-events-none" style={{ width: '0%' }} />
        </div>

        {/* Output */}
        <div ref={outputWrapRef} style={{ opacity: 0, transition: 'opacity 0.35s' }}>
          <div className="bg-accent/6 border border-accent/20 rounded-lg p-3 font-mono text-[0.72rem] text-accent leading-relaxed min-h-[40px]">
            <span ref={outputRef} />
            <span ref={cur2Ref} className="inline-block w-[2px] h-[12px] bg-accent align-middle ml-[1px] animate-pulse" style={{ display: 'none' }} />
          </div>
          <div className="flex justify-between mt-2">
            <span ref={badgeRef} className="font-mono text-[0.65rem] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded" />
            <span ref={costRef} className="font-mono text-[0.65rem] text-text-muted" />
          </div>
        </div>
      </div>
    </div>
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
            People are already saving.
          </h2>
          <p className="font-sans text-[0.94rem] text-text-muted max-w-[480px] mx-auto leading-relaxed">
            Every number here is real and updates live. No vanity metrics, no inflated counts.
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
  { q: 'How does Tokko compress prompts?', a: 'Tokko removes filler words, redundant phrasing, and unnecessary padding while preserving the core meaning of your prompt. Smart mode uses Claude to understand context before compressing, so technical terms and constraints stay intact.' },
  { q: 'Will I get the same AI output with a compressed prompt?', a: 'In most cases, yes. AI models are built to understand direct instructions. They don\'t need "please" and "could you kindly" to perform well. Balanced mode is the safest bet. Aggressive mode works best for simple, straightforward prompts.' },
  { q: 'Which AI models does this work with?', a: 'Any model that accepts text prompts. The compressed output is just cleaner text. Paste it into Claude, ChatGPT, Gemini, Mistral, or any other tool. Tokko itself uses Claude for the compression.' },
  { q: 'Is the free plan actually free?', a: 'Yes. 20 compressions per day, no time limit, no credit card. If you need more, paid plans start at $3/mo.' },
  { q: 'What is BYOK (Bring Your Own Key)?', a: 'You connect your own Anthropic API key to Tokko. Compressions use your key directly, so you pay Anthropic at their rates. You pay Tokko just $3/mo for the software. Since Tokko cuts your token usage by up to 75%, it pays for itself immediately.' },
  { q: 'How is Smart mode different from Balanced?', a: 'Balanced uses rules to strip filler. Smart uses Claude to actually understand your prompt before rewriting it. It preserves nuance, technical terms, and intent while removing everything that adds no value.' },
  { q: 'Is my data safe?', a: 'Your prompts are never used to train any model. Compression history is stored in your dashboard and you can delete it at any time. API keys are stored server-side and never exposed to the browser.' },
  { q: 'Is there a Chrome Extension?', a: 'Yes. The Tokko extension adds a compress button directly inside Claude.ai, so there is no tab switching needed. ChatGPT and Gemini support is coming soon. Generate your token in Settings to connect it.' },
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
            Common questions, straight answers.
          </h2>
          <p className="font-sans text-[0.94rem] md:text-[1rem] text-text-muted max-w-[480px] mx-auto">
            Can&apos;t find what you&apos;re looking for?{' '}
            <a href="mailto:hello@tokko.app" className="text-accent hover:underline">Reach out.</a>
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
          Every prompt you send today<br />costs more than it should.
        </h2>
        <p className="font-sans text-[0.94rem] md:text-[1rem] text-text-muted mb-8 md:mb-9">
          Start compressing for free. No credit card, no commitment. See the difference in your first prompt.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/auth/signup">
            <Button size="lg">Start compressing free</Button>
          </Link>
          <Link href="/#pricing">
            <Button variant="outline" size="lg">View pricing</Button>
          </Link>
        </div>
        <p className="font-mono text-[0.68rem] text-text-muted mt-4">
          20 free compressions per day · No credit card · Upgrade anytime
        </p>
      </div>
    </section>
  )
}