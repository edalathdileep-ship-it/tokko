import Link from 'next/link'
import { Button, BtnArrow } from '@/components/ui/Button'
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
              Stop wasting tokens.<br />
              <span className="text-text-muted">Ship faster.</span>
            </h1>

            <p className="font-sans text-[1rem] md:text-[1.05rem] text-text-muted leading-[1.68] mb-6 max-w-[460px] mx-auto md:mx-0">
              Every prompt you send has filler words that cost you money but add zero value.
              Tokko strips them out. Same output, up to 75% fewer tokens.
            </p>

            {/* Social proof line */}
            <div className="flex items-center gap-2 justify-center md:justify-start mb-8">
              <div className="flex -space-x-2">
                {['#a855f7','#f59e0b','#3b82f6','#ec4899'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-bg-base" style={{ background: c }} />
                ))}
              </div>
              <span className="font-sans text-[0.82rem] text-text-muted">
                Join people saving on their AI bills
              </span>
            </div>

            <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-10 md:mb-13">
              <Link href="/auth/signup">
              <Button size="lg">Start compressing free <BtnArrow /></Button>
              </Link>
              <Link href="/#howitworks">
                <Button variant="outline" size="lg">See how it works</Button>
              </Link>
            </div>

            {/* Real stats */}
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

          {/* Right — Demo card */}
          <div className="relative mt-4 md:mt-0">
            <DemoCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function DemoCard() {
  return (
    <div className="bg-bg-card border border-border rounded-4xl overflow-hidden shadow-hero-card relative top-gradient-border">
      {/* Browser bar */}
      <div className="bg-bg-surface border-b border-border px-4 md:px-5 py-3.5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-red" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
        </div>
        <div className="font-mono text-[0.65rem] text-text-muted bg-bg-s2 px-3 py-1 rounded-md">
          tokko.app
        </div>
        <div className="font-mono text-[0.68rem] text-text bg-bg-s2 border border-border rounded-md px-2 py-1">
          Claude
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 space-y-3.5">
        {/* Cost before */}
        <div className="flex items-center justify-between">
          <div className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-text-muted">
            Before · 64 tokens
          </div>
          <div className="font-mono text-[0.62rem] text-accent-red">~$0.0006/call</div>
        </div>
        <div className="bg-bg-s2 border border-border rounded-lg p-3.5 font-mono text-[0.72rem] md:text-[0.76rem] text-text-muted leading-relaxed">
          Could you please help me understand how I might go about writing a Python function
          that takes a list of numbers and returns only the even ones?
        </div>

        <div className="w-full py-3 bg-accent rounded-lg font-grotesk font-bold text-[0.84rem] text-black text-center">
          Compress →
        </div>

        {/* Cost after */}
        <div className="flex items-center justify-between">
          <div className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-accent">
            After · 18 tokens · −72%
          </div>
          <div className="font-mono text-[0.62rem] text-accent">~$0.00017/call</div>
        </div>
        <div className="bg-accent/6 border border-accent/20 rounded-lg p-3.5 font-mono text-[0.72rem] md:text-[0.76rem] text-accent leading-relaxed">
          Python function: filter even numbers from list. Include explanation + examples.
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[0.68rem] bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 rounded">
            −72% tokens saved
          </span>
          <span className="font-mono text-[0.62rem] text-text-muted">
            At 1000 calls/day → <span className="text-accent">save $142/mo</span>
          </span>
        </div>
      </div>
    </div>
  )
}