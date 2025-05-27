"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { MissionSection } from "@/components/mission-section"
import { GallerySection } from "@/components/gallery-section"
import { LocationSection } from "@/components/location-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { LiveChat } from "@/components/live-chat"
import { QuoteSystem } from "@/components/quote-system"
import { AdminDashboardDynamic } from "@/components/admin-dashboard-dynamic"
import { SupabaseAdminProvider } from "@/contexts/supabase-admin-context"

export default function Home() {
  return (
    <SupabaseAdminProvider>
      <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
        <LiveChat />
        <QuoteSystem />
        <AdminDashboardDynamic />
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <MissionSection />
          <GallerySection />
          <LocationSection />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </SupabaseAdminProvider>
  )
}
