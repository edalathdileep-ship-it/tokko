import { Eyebrow } from '@/components/ui/Chips'

const DOC_LINKS = [
  { icon: 'quick-start.svg', title: 'Quick Start Guide',       sub: 'Get compressing in under 5 minutes', color: 'accent',  tag: null },
  { icon: 'api.svg',         title: 'REST API Reference',      sub: 'Full endpoint documentation',        color: 'purple',  tag: 'soon' },
  { icon: 'code.svg',        title: 'JavaScript SDK',          sub: 'npm install tokko',                  color: 'orange',  tag: 'soon' },
  { icon: 'sdk.svg',         title: 'Python SDK',              sub: 'pip install tokko',                  color: 'teal',    tag: 'soon' },
  { icon: 'team.svg',        title: 'Claude Code Integration', sub: 'MCP server setup guide',             color: 'red',     tag: 'soon' },
]

const iconBg: Record<string, string> = {
  accent: 'bg-accent/10 border-accent/20',
  purple: 'bg-accent-purple/10 border-accent-purple/20',
  orange: 'bg-accent-orange/10 border-accent-orange/20',
  teal:   'bg-accent-teal/10 border-accent-teal/20',
  red:    'bg-accent-red/10 border-accent-red/20',
}

export function Docs() {
  return (
    <section id="docs" className="py-20 md:py-30 border-t border-border bg-bg-surface/30">
      <div className="max-w-content mx-auto px-4 sm:px-8 md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">

          {/* Left */}
          <div>
            <Eyebrow className="mb-4">Documentation</Eyebrow>
            <h2 className="font-grotesk font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-none mb-4">
              Built for developers<br />who move fast.
            </h2>
            <p className="font-sans text-text-muted leading-relaxed mb-8 md:mb-10">
              REST API, SDKs, and guides for every major framework. Most are coming soon — sign up to get notified.
            </p>

            <div className="flex flex-col gap-2">
              {DOC_LINKS.map((d) => (
                <div key={d.title}
                  className="flex items-center gap-4 bg-bg-card border border-border rounded-xl px-4 md:px-5 py-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconBg[d.color]}`}>
                    <img src={`/${d.icon}`} alt={d.title} width={22} height={22} style={{ filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-grotesk font-bold text-[0.9rem]">{d.title}</div>
                    <div className="font-mono text-[0.68rem] text-text-muted mt-0.5">{d.sub}</div>
                  </div>
                  {d.tag && (
                    <span className="font-mono text-[0.6rem] font-bold px-2 py-0.5 rounded border bg-bg-s2 text-text-muted border-border flex-shrink-0">
                      {d.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Code block, hidden on small mobile, shown md+ */}
          <div className="hidden sm:block space-y-4">
            <div className="bg-bg-surface border border-border rounded-2xl overflow-hidden font-mono text-[0.75rem] md:text-[0.78rem]">
              <div className="bg-bg-s2 px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex gap-1">
                  {['JavaScript', 'Python', 'cURL'].map((t, i) => (
                    <div key={t} className={`px-2.5 py-1.5 rounded text-[0.7rem] font-semibold ${i === 0 ? 'bg-border text-text' : 'text-text-muted'}`}>
                      {t}
                    </div>
                  ))}
                </div>
                <span className="text-[0.65rem] text-text-muted">Copy</span>
              </div>
              <div className="p-4 md:p-5 leading-[1.75] overflow-x-auto">
                <pre className="whitespace-pre-wrap"><span className="text-accent-purple">import</span> Tokko <span className="text-accent-purple">from</span> <span className="text-accent">'tokko'</span>{';'}

<span className="text-accent-purple">const</span> ps = <span className="text-accent-purple">new</span> <span className="text-accent-orange">Tokko</span>{'({'}
  apiKey: <span className="text-accent">'your_api_key'</span>,
  model: <span className="text-accent">'claude'</span>
{'});'}

<span className="text-accent-purple">const</span> result = <span className="text-accent-purple">await</span> ps.<span className="text-accent-orange">compress</span>{'({'}
  prompt: userPrompt,
  mode: <span className="text-accent">'balanced'</span>
{'});'}

<span className="text-text-muted">// result.savedPct → </span><span className="text-accent-teal">72</span>
<span className="text-text-muted">// result.costSaved → </span><span className="text-accent-teal">0.000138</span></pre>
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-xl p-4 md:p-5">
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-text-muted mb-3">Response</div>
              <pre className="font-mono text-[0.72rem] md:text-[0.75rem] leading-[1.7] text-text-muted whitespace-pre-wrap overflow-x-auto"><span className="text-border">{'{'}</span>
  <span className="text-text">"compressed"</span>: <span className="text-accent">"Python fn: filter even nums..."</span>,
  <span className="text-text">"originalTokens"</span>: <span className="text-accent-teal">64</span>,
  <span className="text-text">"compressedTokens"</span>: <span className="text-accent-teal">18</span>,
  <span className="text-text">"savedPct"</span>: <span className="text-accent-teal">72</span>
<span className="text-border">{'}'}</span></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}