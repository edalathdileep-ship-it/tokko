import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-[720px] mx-auto px-[48px] pt-32 pb-24">
        <h1 className="font-grotesk font-bold text-[2.5rem] tracking-tight mb-2">Privacy Policy</h1>
        <p className="font-mono text-[0.72rem] text-text-muted mb-12">Last updated: March 2026</p>

        <div className="space-y-10 font-sans text-[0.92rem] text-text-muted leading-relaxed">
          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">What we collect</h2>
            <p>When you create an account we collect your email address and name. When you use Tokko we store your compression history (original prompt, compressed prompt, token counts) so you can review it in your dashboard.</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">What we don't do</h2>
            <p>We do not sell your data. We do not use your prompts to train AI models. We do not share your data with third parties except as required to operate the service (Clerk for auth, Supabase for database).</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Your data</h2>
            <p>You can delete your compression history at any time from your dashboard. You can delete your account by contacting us at hello@tokko.app — we will remove all your data within 30 days.</p>
          </section>

          <section>
            <h2 className="font-grotesk font-bold text-[1.1rem] text-text mb-3">Cookies</h2>
            <p>We use cookies only for authentication (keeping you logged in). We do not use advertising or tracking cookies.</p>
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