import { MainBanner } from "@/app/components/main-banner/main-banner"
import { ProductSection } from "@/app/components/product-section/product-section"
import { CombosSection } from "@/app/components/combos-sections/combos-sections"
import { SiteHeader } from "./components/site-header/site-header";
import { MainNav } from "./components/main-nav/main-nav";
import { CategoryIcons } from "./components/category-icons/category-icons";
import { SiteFooter } from "./components/site-footer/site-footer";


export default function Home() {
  return (
    <main className="bg-white">
      <SiteHeader />
      <MainNav />
      <CategoryIcons />
      {/* Banner Principal */}
      <MainBanner />

      {/* Seção de Produtos */}
      <ProductSection />

      {/* Seção de Combos Especiais */}
      <CombosSection />

      {/* Cria o checkout da stripe */}

      <SiteFooter />

    </main>
  )
}