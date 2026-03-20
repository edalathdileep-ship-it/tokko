import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

function Code({ children, lang }: { children: string; lang?: string }) {
  return (
    <pre className="bg-bg-surface border border-border rounded-xl p-4 overflow-x-auto">
      <code className="font-mono text-[0.78rem] leading-relaxed text-text-muted whitespace-pre">
        {children}
      </code>
    </pre>
  )
}

function Param({ name, type, required, def, children }: {
  name: string; type: string; required?: boolean; def?: string; children: React.ReactNode
}) {
  return (
    <div className="py-4 border-b border-border last:border-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-mono text-[0.82rem] text-accent font-bold">{name}</span>
        <span className="font-mono text-[0.65rem] text-text-muted bg-bg-s2 px-1.5 py-0.5 rounded">{type}</span>
        {required && <span className="font-mono text-[0.6rem] text-accent-red font-bold">required</span>}
        {def && <span className="font-mono text-[0.6rem] text-text-muted">default: {def}</span>}
      </div>
      <p className="font-sans text-[0.82rem] text-text-muted leading-relaxed">{children}</p>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <h2 className="font-grotesk font-bold text-[1.3rem] tracking-tight mb-6">{title}</h2>
      {children}
    </section>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-[820px] mx-auto px-4 sm:px-8 pt-28 pb-24">

        {/* Header */}
        <div className="mb-14">
          <div className="font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent mb-3">
            API Reference
          </div>
          <h1 className="font-grotesk font-bold text-[2rem] tracking-tight mb-3">
            Tokko API
          </h1>
          <p className="font-sans text-[1rem] text-text-muted leading-relaxed max-w-[540px]">
            Compress prompts programmatically. One endpoint, one API key. Add prompt compression
            to any app in under 5 minutes.
          </p>
        </div>

        {/* Quick nav */}
        <div className="flex gap-2 flex-wrap mb-14">
          {['Authentication', 'Compress', 'Response', 'Errors', 'Examples'].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className="font-mono text-[0.72rem] text-text-muted bg-bg-card border border-border rounded-lg px-3 py-1.5 hover:text-accent hover:border-accent/30 transition-colors"
            >
              {s}
            </a>
          ))}
        </div>

        {/* Base URL */}
        <Section id="base" title="Base URL">
          <Code>{`https://tokko-seven.vercel.app/api/v1`}</Code>
        </Section>

        {/* Authentication */}
        <Section id="authentication" title="Authentication">
          <p className="font-sans text-[0.88rem] text-text-muted leading-relaxed mb-4">
            All requests require a Bearer token in the Authorization header.
            Generate your token from the{' '}
            <Link href="/dashboard/settings" className="text-accent hover:underline">Settings page</Link>.
          </p>
          <Code>{`Authorization: Bearer tkk_your_token_here`}</Code>
          <div className="mt-4 bg-accent-orange/5 border border-accent-orange/20 rounded-xl px-4 py-3">
            <p className="font-mono text-[0.72rem] text-accent-orange">
              Keep your token secret. Do not expose it in client-side code or public repositories.
            </p>
          </div>
        </Section>

        {/* Compress endpoint */}
        <Section id="compress" title="POST /v1/compress">
          <div className="bg-bg-card border border-border rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="font-mono text-[0.72rem] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">POST</span>
            <span className="font-mono text-[0.82rem] text-text">/api/v1/compress</span>
          </div>

          <p className="font-sans text-[0.88rem] text-text-muted leading-relaxed mb-6">
            Compresses a prompt and returns the shorter version with token usage stats.
          </p>

          <h3 className="font-grotesk font-bold text-[0.94rem] mb-3">Request body</h3>
          <div className="bg-bg-card border border-border rounded-xl px-5">
            <Param name="prompt" type="string" required>
              The text to compress. Maximum 200,000 characters.
            </Param>
            <Param name="mode" type="string" def='"balanced"'>
              Compression level. Options: <span className="font-mono text-accent">balanced</span> (keeps full meaning, ~50% reduction),{' '}
              <span className="font-mono text-accent">aggressive</span> (keyword-only, ~75% reduction),{' '}
              <span className="font-mono text-accent">smart</span> (AI-powered, best quality).
            </Param>
            <Param name="model" type="string" def='"claude"'>
              Target model for cost calculation. Options: <span className="font-mono text-accent">claude</span>,{' '}
              <span className="font-mono text-accent">gpt4</span>,{' '}
              <span className="font-mono text-accent">gemini</span>.
              This affects the cost_saved_usd calculation only.
            </Param>
          </div>
        </Section>

        {/* Response */}
        <Section id="response" title="Response">
          <p className="font-sans text-[0.88rem] text-text-muted leading-relaxed mb-4">
            A successful response returns the compressed text along with usage statistics.
          </p>
          <Code>{`{
  "compressed": "Python function: filter even numbers from list.",
  "usage": {
    "original_tokens": 64,
    "compressed_tokens": 18,
    "tokens_saved": 46,
    "reduction_pct": 72,
    "cost_saved_usd": 0.000138
  },
  "meta": {
    "mode": "balanced",
    "model": "claude",
    "id": "ps_1711234567_abc1234"
  }
}`}</Code>

          <h3 className="font-grotesk font-bold text-[0.94rem] mt-8 mb-3">Response fields</h3>
          <div className="bg-bg-card border border-border rounded-xl px-5">
            <Param name="compressed" type="string">
              The compressed prompt text. Ready to send to any AI model.
            </Param>
            <Param name="usage.original_tokens" type="number">
              Token count of the original prompt.
            </Param>
            <Param name="usage.compressed_tokens" type="number">
              Token count of the compressed result.
            </Param>
            <Param name="usage.tokens_saved" type="number">
              How many tokens were removed.
            </Param>
            <Param name="usage.reduction_pct" type="number">
              Percentage reduction (0 to 100).
            </Param>
            <Param name="usage.cost_saved_usd" type="number">
              Estimated dollar savings based on the selected model.
            </Param>
          </div>

          <h3 className="font-grotesk font-bold text-[0.94rem] mt-8 mb-3">Rate limit headers</h3>
          <div className="bg-bg-card border border-border rounded-xl px-5">
            <Param name="X-RateLimit-Limit" type="header">
              Your daily compression limit (e.g. 20 on free plan).
            </Param>
            <Param name="X-RateLimit-Remaining" type="header">
              Compressions remaining today.
            </Param>
          </div>
        </Section>

        {/* Errors */}
        <Section id="errors" title="Errors">
          <p className="font-sans text-[0.88rem] text-text-muted leading-relaxed mb-4">
            Errors return a consistent format with an error code you can handle programmatically.
          </p>
          <Code>{`{
  "error": {
    "message": "Daily limit reached (20/day on free plan)",
    "code": "rate_limit_exceeded",
    "status": 429
  }
}`}</Code>

          <h3 className="font-grotesk font-bold text-[0.94rem] mt-8 mb-3">Error codes</h3>
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-mono text-[0.68rem] text-text-muted px-5 py-3">Status</th>
                  <th className="text-left font-mono text-[0.68rem] text-text-muted px-5 py-3">Code</th>
                  <th className="text-left font-mono text-[0.68rem] text-text-muted px-5 py-3">Meaning</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[0.78rem]">
                {[
                  ['400', 'validation_error', 'Invalid request body or parameters'],
                  ['400', 'prompt_too_large', 'Prompt exceeds 200k characters'],
                  ['401', 'auth_required', 'Missing Authorization header'],
                  ['401', 'invalid_token', 'Token is invalid or expired'],
                  ['429', 'rate_limit_exceeded', 'Daily compression limit reached'],
                  ['503', 'service_overloaded', 'AI is temporarily busy, retry'],
                  ['500', 'internal_error', 'Something went wrong on our end'],
                ].map(([status, code, meaning]) => (
                  <tr key={code} className="border-b border-border last:border-0">
                    <td className="px-5 py-2.5 text-text-muted">{status}</td>
                    <td className="px-5 py-2.5 text-accent-red">{code}</td>
                    <td className="px-5 py-2.5 text-text-muted font-sans text-[0.78rem]">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Examples */}
        <Section id="examples" title="Examples">

          <h3 className="font-grotesk font-bold text-[0.94rem] mb-3">cURL</h3>
          <Code>{`curl -X POST https://tokko-seven.vercel.app/api/v1/compress \\
  -H "Authorization: Bearer tkk_your_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Could you please help me write a Python function that filters even numbers from a list?",
    "mode": "balanced"
  }'`}</Code>

          <h3 className="font-grotesk font-bold text-[0.94rem] mt-8 mb-3">Python</h3>
          <Code>{`import requests

response = requests.post(
    "https://tokko-seven.vercel.app/api/v1/compress",
    headers={"Authorization": "Bearer tkk_your_token"},
    json={
        "prompt": "Could you please help me write a Python function that filters even numbers from a list?",
        "mode": "balanced"
    }
)

data = response.json()
print(data["compressed"])
# "Python function: filter even numbers from list."
print(f"Saved {data['usage']['reduction_pct']}% tokens")`}</Code>

          <h3 className="font-grotesk font-bold text-[0.94rem] mt-8 mb-3">JavaScript / Node.js</h3>
          <Code>{`const response = await fetch("https://tokko-seven.vercel.app/api/v1/compress", {
  method: "POST",
  headers: {
    "Authorization": "Bearer tkk_your_token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Could you please help me write a Python function that filters even numbers from a list?",
    mode: "balanced",
  }),
});

const data = await response.json();
console.log(data.compressed);
// "Python function: filter even numbers from list."
console.log(\`Saved \${data.usage.reduction_pct}% tokens\`);`}</Code>

          <h3 className="font-grotesk font-bold text-[0.94rem] mt-8 mb-3">Use with OpenAI / Anthropic SDK</h3>
          <p className="font-sans text-[0.82rem] text-text-muted leading-relaxed mb-3">
            Compress your prompt before passing it to any AI SDK.
          </p>
          <Code>{`import Anthropic from "@anthropic-ai/sdk";

// 1. Compress the prompt first
const tokko = await fetch("https://tokko-seven.vercel.app/api/v1/compress", {
  method: "POST",
  headers: {
    "Authorization": "Bearer tkk_your_token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ prompt: userInput, mode: "smart" }),
});
const { compressed } = await tokko.json();

// 2. Send the compressed prompt to Claude
const anthropic = new Anthropic();
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: compressed }],
});`}</Code>
        </Section>

        {/* CTA */}
        <div className="bg-bg-card border border-border rounded-2xl p-8 text-center mt-8">
          <h3 className="font-grotesk font-bold text-[1.1rem] mb-2">Ready to integrate?</h3>
          <p className="font-sans text-[0.88rem] text-text-muted mb-6">
            Sign up for free and generate your API token from Settings.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="font-grotesk font-medium text-[0.88rem] bg-accent text-black px-6 py-2.5 rounded-xl hover:bg-accent-hover transition-colors"
            >
              Get your API token
            </Link>
            <Link
              href="/dashboard/settings"
              className="font-grotesk font-medium text-[0.88rem] border border-border text-text-muted px-6 py-2.5 rounded-xl hover:text-text hover:border-border/80 transition-colors"
            >
              Go to Settings
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
