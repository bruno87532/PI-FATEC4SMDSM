import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryNav } from "@/components/category-nav"
import { MainBanner } from "@/components/main-banner"
import { ProductSection } from "@/components/product-section"
import { CombosSection } from "@/components/combos-sections"



export default function Home() {
  return (
    <main className="bg-white">
      
      {/* Banner Principal */}
      <MainBanner />

      {/* Seção de Produtos */}
      <ProductSection />
      
      {/* Seção de Combos Especiais */}
      <CombosSection />

    </main>
  )
}