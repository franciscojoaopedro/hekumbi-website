import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { MissionSection } from "@/components/mission-section"
import { GallerySection } from "@/components/gallery-section"
import { LocationSection } from "@/components/location-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { LiveChat } from "@/components/live-chat"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { QuoteSystem } from "@/components/quote-system"
import { ScrollProgress } from "@/components/scroll-progress"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white overflow-hidden">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <MissionSection />
      <GallerySection />
      <LocationSection />
      <ContactSection />
      <Footer />
      <LiveChat />
      <WhatsAppButton />
      <QuoteSystem />
      <ScrollProgress />
    </main>
  )
}
