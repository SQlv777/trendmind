import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ContentSection } from "@/components/content-section"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Hero />
      <ContentSection />
      <Newsletter />
      <Footer />
    </div>
  )
}
