'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { KickerPill } from '@/components/ui/Chips'

export function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px] pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

          {/* Left */}
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <KickerPill>Chrome Extension now available</KickerPill>
            </div>

            <h1 className="font-grotesk font-bold tracking-[-0.04em] leading-none mt-7 mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)' }}>
              You&apos;re paying for<br />
              <span className="text-accent">words AI ignores.</span>
            </h1>

            <p className="font-sans text-[1rem] md:text-[1.05rem] text-text-muted leading-[1.68] mb-6 max-w-[460px] mx-auto md:mx-0">
              Up to 75% of your prompt is filler — pleasantries, repetition, padding.
              AI reads past it, but you still pay for every token.
              Tokko strips the waste. Same results, fraction of the cost.
            </p>

            <div className="flex items-center gap-2 justify-center md:justify-start mb-8">
              <div className="flex -space-x-2">
                {['#a855f7','#f59e0b','#3b82f6','#ec4899'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-bg-base" style={{ background: c }} />
                ))}
              </div>
              <span className="font-sans text-[0.82rem] text-text-muted">
                Saving on AI costs right now
              </span>
            </div>

            <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-10 md:mb-13">
              <Link href="/auth/signup">
                <Button size="lg">Start compressing free</Button>
              </Link>
              <Link href="/#howitworks">
                <Button variant="outline" size="lg">See how it works</Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 md:gap-8 justify-center md:justify-start">
              <div>
                <div className="font-grotesk font-bold text-[1.4rem] md:text-[1.6rem] tracking-tight text-accent">75%</div>
                <div className="font-mono text-[0.62rem] text-text-muted mt-0.5 tracking-[0.04em]">fewer tokens</div>
              </div>
              <div className="w-px h-9 bg-border" />
              <div>
                <div className="font-grotesk font-bold text-[1.4rem] md:text-[1.6rem] tracking-tight">$0</div>
                <div className="font-mono text-[0.62rem] text-text-muted mt-0.5">free to start</div>
              </div>
              <div className="w-px h-9 bg-border" />
              <div>
                <div className="font-grotesk font-bold text-[1.4rem] md:text-[1.6rem] tracking-tight">2 sec</div>
                <div className="font-mono text-[0.62rem] text-text-muted mt-0.5">to compress</div>
              </div>
            </div>
          </div>

          {/* Right — Animated Demo */}
          <div className="relative mt-4 md:mt-0">
            <AnimatedDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedDemo() {
  const inputRef = useRef<HTMLSpanElement>(null)
  const outputRef = useRef<HTMLSpanElement>(null)
  const cursor1Ref = useRef<HTMLSpanElement>(null)
  const cursor2Ref = useRef<HTMLSpanElement>(null)
  const beforeMetaRef = useRef<HTMLDivElement>(null)
  const compressWrapRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const afterSectionRef = useRef<HTMLDivElement>(null)
  const savingsBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const inputFull = "Could you please help me understand how I might go about writing a Python function that takes a list of numbers and returns only the even ones?"
    const outputFull = "Python function: filter even numbers from list. Include explanation + examples."

    let cancelled = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    async function typeText(el: HTMLSpanElement, cur: HTMLSpanElement, text: string, speed = 24) {
      cur.style.display = 'inline-block'
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return
        el.textContent = text.slice(0, i + 1)
        await sleep(speed + Math.random() * 12)
      }
      cur.style.display = 'none'
    }

    async function clearText(el: HTMLSpanElement, speed = 12) {
      let t = el.textContent || ''
      while (t.length > 0) {
        if (cancelled) return
        t = t.slice(0, -1)
        el.textContent = t
        await sleep(speed)
      }
    }

    async function runLoop() {
      while (!cancelled) {
        const input = inputRef.current
        const output = outputRef.current
        const cur1 = cursor1Ref.current
        const cur2 = cursor2Ref.current
        const beforeMeta = beforeMetaRef.current
        const compressWrap = compressWrapRef.current
        const progressBar = progressBarRef.current
        const afterSection = afterSectionRef.current
        const savingsBar = savingsBarRef.current
        if (!input || !output || !cur1 || !cur2 || !beforeMeta || !compressWrap || !progressBar || !afterSection || !savingsBar) return

        // Reset
        input.textContent = ''
        output.textContent = ''
        cur1.style.display = 'none'
        cur2.style.display = 'none'
        beforeMeta.style.opacity = '0'
        compressWrap.style.opacity = '0'
        afterSection.style.opacity = '0'
        savingsBar.style.opacity = '0'
        progressBar.style.transition = 'none'
        progressBar.style.width = '0%'
        await sleep(800)

        // Type input
        await typeText(input, cur1, inputFull, 22)
        if (cancelled) return

        // Show before meta + compress button after typing done
        beforeMeta.style.opacity = '1'
        await sleep(200)
        compressWrap.style.opacity = '1'
        await sleep(700)

        // Progress bar
        progressBar.style.transition = 'none'
        progressBar.style.width = '0%'
        await sleep(30)
        progressBar.style.transition = 'width 1.5s ease-in-out'
        progressBar.style.width = '100%'
        await sleep(1600)
        progressBar.style.transition = 'none'
        progressBar.style.width = '0%'
        await sleep(200)

        // Show after + type output
        afterSection.style.opacity = '1'
        cur2.style.display = 'inline-block'
        await sleep(150)
        await typeText(output, cur2, outputFull, 28)
        if (cancelled) return

        // Show savings
        savingsBar.style.opacity = '1'
        await sleep(4500)

        // Clear and restart
        savingsBar.style.opacity = '0'
        await clearText(output, 10)
        afterSection.style.opacity = '0'
        await sleep(200)
        beforeMeta.style.opacity = '0'
        compressWrap.style.opacity = '0'
        await clearText(input, 8)
        await sleep(1000)
      }
    }

    runLoop()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="bg-bg-card border border-border rounded-4xl overflow-hidden shadow-hero-card">
      {/* Browser bar */}
      <div className="bg-bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-red" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
        </div>
        <div className="font-mono text-[0.65rem] text-text-muted bg-bg-s2 px-3 py-1 rounded-md">tokko.app</div>
        <div className="font-mono text-[0.68rem] text-text bg-bg-s2 border border-border rounded-md px-2 py-1">Claude</div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 space-y-3.5">

        {/* Before meta — hidden until typing done */}
        <div ref={beforeMetaRef} className="flex items-center justify-between" style={{ opacity: 0, transition: 'opacity 0.4s' }}>
          <div className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-text-muted">
            Before · 64 tokens
          </div>
          <div className="font-mono text-[0.62rem] text-accent-red">~$0.0006/call</div>
        </div>

        {/* Input box */}
        <div className="bg-bg-s2 border border-border rounded-lg p-3.5 font-mono text-[0.72rem] md:text-[0.76rem] text-text-muted leading-relaxed min-h-[80px]">
          <span ref={inputRef} />
          <span ref={cursor1Ref} className="inline-block w-[2px] h-[13px] bg-accent align-middle ml-[1px] animate-pulse" style={{ display: 'none' }} />
        </div>

        {/* Compress button — hidden until typing done */}
        <div ref={compressWrapRef} style={{ opacity: 0, transition: 'opacity 0.4s' }}>
          <div className="w-full py-3 bg-accent rounded-lg font-grotesk font-bold text-[0.84rem] text-black text-center relative overflow-hidden">
            Compress
            <div ref={progressBarRef} className="absolute left-0 top-0 h-full bg-black/10 pointer-events-none" style={{ width: '0%' }} />
          </div>
        </div>

        {/* After section */}
        <div ref={afterSectionRef} style={{ opacity: 0, transition: 'opacity 0.4s' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-accent">
              After · 18 tokens · −72%
            </div>
            <div className="font-mono text-[0.62rem] text-accent">~$0.00017/call</div>
          </div>
          <div className="bg-accent/6 border border-accent/20 rounded-lg p-3.5 font-mono text-[0.72rem] md:text-[0.76rem] text-accent leading-relaxed min-h-[48px]">
            <span ref={outputRef} />
            <span ref={cursor2Ref} className="inline-block w-[2px] h-[13px] bg-accent align-middle ml-[1px] animate-pulse" style={{ display: 'none' }} />
          </div>
        </div>

        {/* Savings bar */}
        <div ref={savingsBarRef} className="flex items-center justify-between pt-1" style={{ opacity: 0, transition: 'opacity 0.4s' }}>
          <span className="font-mono text-[0.68rem] bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 rounded">
            −72% tokens saved
          </span>
          <span className="font-mono text-[0.62rem] text-text-muted">
            At 1000 calls/day · <span className="text-accent">save $142/mo</span>
          </span>
        </div>
      </div>
    </div>
  )
}
