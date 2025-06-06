import { MainBanner } from "@/app/components/main-banner/main-banner"
import { ProductSection } from "@/app/components/product-section/product-section"
import { SiteHeader } from "./components/site-header/site-header";
import { SiteFooter } from "./components/site-footer/site-footer";
import { CartProvider } from "./context/cart-context";
import { UserProvider } from "./context/user-context";
import { IsLoginOpenProvider } from "./context/is-login-open";

export default function Home() {
  return (
    <main className="bg-white">
      <UserProvider>
        <CartProvider>
          <IsLoginOpenProvider>
            <SiteHeader />
            <MainBanner />
            <ProductSection />
            <SiteFooter />
          </IsLoginOpenProvider>
        </CartProvider>
      </UserProvider>
    </main>
  )
}