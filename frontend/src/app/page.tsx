import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Mission } from "@/components/landing/mission";
import { AiDemo } from "@/components/landing/ai-demo";
import { Features } from "@/components/landing/features";
import { RankingPreview } from "@/components/landing/ranking-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Mission />
        <AiDemo />
        <Features />
        <RankingPreview />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
