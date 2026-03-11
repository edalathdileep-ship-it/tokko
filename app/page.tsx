import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ModelsStrip, Features, HowItWorks, SocialProof, CTABanner, FAQ } from '@/components/sections/Sections'
import { Pricing } from '@/components/sections/Pricing'
import { Docs } from '@/components/sections/Docs'
import { BackgroundEffects } from '@/components/sections/BackgroundEffects'

export default function Home() {
  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <ModelsStrip />
          <Features />
          <HowItWorks />
          <Pricing />
          <Docs />
          <SocialProof />
          <FAQ />
          <CTABanner />
        </main>
        <Footer />
      </div>
    </>
  )
}