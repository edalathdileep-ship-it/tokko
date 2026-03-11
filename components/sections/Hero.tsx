import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { KickerPill } from '@/components/ui/Chips'

export function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-content mx-auto px-[48px] pt-32 pb-20 w-full">
        <div className="grid grid-cols-2 gap-20 items-center">

          {/* Left */}
          <div>
            <KickerPill>
              Now supporting Claude, GPT-4 &amp; Gemini
            </KickerPill>

            <h1 className="font-grotesk font-bold tracking-[-0.04em] leading-none mt-7 mb-6"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 5rem)' }}>
              Stop wasting tokens.<br />
              <span className="text-text-muted">Ship faster.</span>
            </h1>

            <p className="font-sans text-[1.05rem] text-text-muted leading-[1.68] mb-10 max-w-[460px]">
              Tokko compresses your AI prompts by up to 75% — same output, fraction of the cost.
              Works across every major model. No API key needed to start.
            </p>

            <div className="flex gap-3 flex-wrap mb-13">
              <Link href="/auth/signup">
                <Button size="lg">Start compressing free →</Button>
              </Link>
              <Link href="/#howitworks">
                <Button variant="outline" size="lg">See how it works</Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div>
                <div className="font-grotesk font-bold text-[1.6rem] tracking-tight text-accent">75%</div>
                <div className="font-mono text-[0.65rem] text-text-muted mt-0.5 tracking-[0.04em]">avg token reduction</div>
              </div>
              <div className="w-px h-9 bg-border" />
              <div>
                <div className="font-grotesk font-bold text-[1.6rem] tracking-tight">3 models</div>
                <div className="font-mono text-[0.65rem] text-text-muted mt-0.5">Claude · GPT · Gemini</div>
              </div>
              <div className="w-px h-9 bg-border" />
              <div>
                <div className="font-grotesk font-bold text-[1.6rem] tracking-tight">$0</div>
                <div className="font-mono text-[0.65rem] text-text-muted mt-0.5">free to start</div>
              </div>
            </div>
          </div>

          {/* Right — Demo card */}
          <div className="relative">
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
      <div className="bg-bg-surface border-b border-border px-5 py-3.5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-red" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
        </div>
        <div className="font-mono text-[0.68rem] text-text-muted bg-bg-s2 px-3 py-1 rounded-md">
          tokko.app
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.7rem] text-text bg-bg-s2 border border-border rounded-md px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
          Claude Sonnet
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3.5">
        <div className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-text-muted">
          Original · 64 tokens
        </div>
        <div className="bg-bg-s2 border border-border rounded-lg p-3.5 font-mono text-[0.76rem] text-text-muted leading-relaxed">
          Could you please help me understand how I might go about writing a Python function
          that takes a list of numbers and returns only the even ones? I would appreciate a
          detailed explanation with examples if possible.
        </div>

        <div className="w-full py-3 bg-accent rounded-lg font-grotesk font-bold text-[0.84rem] text-black text-center">
          Compress →
        </div>

        <div className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-accent">
          Compressed · 18 tokens · saved 72%
        </div>
        <div className="bg-accent/6 border border-accent/20 rounded-lg p-3.5 font-mono text-[0.76rem] text-accent leading-relaxed">
          Python function: filter even numbers from list. Include explanation + examples.
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.7rem] bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 rounded">
            −72% tokens saved
          </span>
          <span className="font-mono text-[0.65rem] text-text-muted">saved ~$0.0002 per call</span>
        </div>
      </div>
    </div>
  )
}
