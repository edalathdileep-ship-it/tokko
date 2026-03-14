import { Eyebrow } from '@/components/ui/Chips'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Docs() {
  return (
    <section id="extension" className="py-20 md:py-30 border-t border-border bg-bg-surface/30">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

          {/* Left */}
          <div>
            <Eyebrow className="mb-4">Chrome Extension</Eyebrow>
            <h2 className="font-grotesk font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-none mb-4">
              Compress without<br />leaving Claude.ai
            </h2>
            <p className="font-sans text-text-muted leading-relaxed mb-6">
              Install the Tokko extension and a subtle compress button appears every time you click the chat input. One click — your prompt is compressed in place. No switching tabs, no copy-pasting.
            </p>

            {/* Supported sites */}
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-mono text-[0.7rem] text-accent font-bold">Claude.ai — Live</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border rounded-lg opacity-60">
                <div className="w-2 h-2 rounded-full bg-text-muted" />
                <span className="font-mono text-[0.7rem] text-text-muted">ChatGPT — Soon</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border rounded-lg opacity-60">
                <div className="w-2 h-2 rounded-full bg-text-muted" />
                <span className="font-mono text-[0.7rem] text-text-muted">Gemini — Soon</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { step: '1', text: 'Install from Chrome Web Store' },
                { step: '2', text: 'Generate your API token in Settings' },
                { step: '3', text: 'Click inside Claude.ai input — Tokko appears' },
                { step: '4', text: 'Click Compress — done in 2 seconds' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-mono font-bold text-[0.78rem] text-accent flex-shrink-0">
                    {s.step}
                  </div>
                  <span className="font-sans text-[0.88rem] text-text-muted">{s.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/auth/signup">
                <Button size="sm">Get started free →</Button>
              </Link>
              <a href="/#pricing">
                <Button variant="outline" size="sm">View pricing</Button>
              </a>
            </div>
          </div>

          {/* Right — Extension preview */}
          <div className="space-y-4">
            {/* Claude.ai mockup with button */}
            <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-bg-surface border-b border-border px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent-red" />
                  <div className="w-2 h-2 rounded-full bg-accent-orange" />
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div className="font-mono text-[0.65rem] text-text-muted ml-2">claude.ai</div>
              </div>
              <div className="p-4 relative">
                {/* Tokko button floating */}
                <div className="absolute top-2 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(10,10,10,0.92)] border border-white/10 rounded-lg text-[0.72rem] font-semibold text-white/80 shadow-lg">
                  <div className="w-4 h-4 bg-accent rounded-[3px] flex items-center justify-center text-[9px] font-black text-black">T</div>
                  Compress
                </div>
                <div className="bg-bg-surface border border-border rounded-xl p-3 font-mono text-[0.72rem] text-text-muted leading-relaxed min-h-[80px]">
                  Could you please help me understand how I might go about writing a Python function that filters even numbers...
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="font-mono text-[0.62rem] text-text-muted">Sonnet 4.5</div>
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* After compression */}
            <div className="bg-bg-card border border-accent/20 rounded-2xl p-4">
              <div className="font-mono text-[0.6rem] text-accent font-bold tracking-wider uppercase mb-2">After compression</div>
              <div className="font-mono text-[0.78rem] text-accent leading-relaxed mb-3">
                Python function: filter even numbers from list. Include explanation + examples.
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.65rem] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded">−72% tokens</span>
                <span className="font-mono text-[0.65rem] text-text-muted">saved $0.00043 this call</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}