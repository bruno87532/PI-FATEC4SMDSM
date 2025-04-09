import { MainBanner } from "@/components/main-banner"
import { SiteHeader } from "../components/site-header/site-header";
import { Stripe } from "../components/stripe/stripe";
import { MainNav } from "../components/main-nav/main-nav";
import { SiteFooter } from "../components/site-footer/site-footer";
import { CategoryIcons } from "../components/category-icons/category-icons";
export default function Home() {
  return (
    <main className="bg-white">
      <SiteHeader />
      <MainNav />
      <CategoryIcons />
      {/* Banner Principal */}
      <MainBanner />


      {/* Cria o checkout da stripe */}
      <Stripe />
      <SiteFooter />

    </main>
  )
}