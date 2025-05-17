import { MainBanner } from "@/app/components/main-banner/main-banner"
import { ProductSection } from "@/app/components/product-section/product-section"
import { SiteHeader } from "./components/site-header/site-header";
import { MainNav } from "./components/main-nav/main-nav";
import { CategoryIcons } from "./components/category-icons/category-icons";
import { SiteFooter } from "./components/site-footer/site-footer";
import { CartProvider } from "./context/cart-context";
import { UserProvider } from "./context/user-context";

export default function Home() {
  return (
    <main className="bg-white">
      <UserProvider>
        <CartProvider>
          <SiteHeader />
          <MainNav />
          <CategoryIcons />
          <MainBanner />
          <ProductSection />
          <SiteFooter />
        </CartProvider>
      </UserProvider>
    </main>
  )
}