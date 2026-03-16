import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-[720px] mx-auto px-[48px] pt-32 pb-24">
        <h1 className="font-grotesk font-bold text-[2.5rem] tracking-tight mb-2">Terms of Service</h1>
        <p className="font-mono text-[0.72rem] text-text-muted mb-12">Last updated: March 2026</p>

        <div className="space-y-10 font-sans text-[0.92rem] text-text-muted leading-relaxed">
          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Using Tokko</h2>
            <p>By using Tokko you agree to use it only for lawful purposes. You may not use Tokko to compress prompts intended to generate harmful, illegal, or abusive content.</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Your account</h2>
            <p>You are responsible for keeping your account credentials secure. Free accounts are limited to 20 compressions per day. We reserve the right to suspend accounts that abuse the service.</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Availability</h2>
            <p>We aim for high availability but do not guarantee 100% uptime. We may change or discontinue features with reasonable notice.</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Payments</h2>
            <p>Paid plans are billed monthly or annually. You can cancel at any time — your plan remains active until the end of the billing period. We do not offer refunds for partial periods.</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Liability</h2>
            <p>Tokko is provided as-is. We are not liable for any losses arising from compressed prompts producing different outputs than expected. Always review compressed prompts before using them in critical applications.</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Contact</h2>
            <p>Questions? Email us at <a href="mailto:hello@tokko.app" className="text-accent hover:underline">hello@tokko.app</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}