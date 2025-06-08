"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ContentSection } from "@/components/content-section"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/lib/contexts/language-context"

export default function HomePage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Features />
          <ContentSection />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
