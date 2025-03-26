import { MainBanner } from "@/components/main-banner"
import { ProductSection } from "@/components/product-section"
import { CombosSection } from "@/components/combos-sections"
import { Stripe } from "./components/stripe/stripe"


export default function Home() {
  return (
    <main className="bg-white">
      
      {/* Banner Principal */}
      <MainBanner />

      {/* Seção de Produtos */}
      <ProductSection />
      
      {/* Seção de Combos Especiais */}
      <CombosSection />

      {/* Cria o checkout da stripe */}
      <Stripe />

    </main>
  )
}