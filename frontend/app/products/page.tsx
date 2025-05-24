"use client"

import { SiteHeader } from "@/app/components/site-header/site-header"
import { MainNav } from "@/app/components/main-nav/main-nav"
import { SiteFooter } from "@/app/components/site-footer/site-footer"
import { CartProvider } from "@/app/context/cart-context"
import { ProductGrid } from "./components/pruduct-grid"
import { Category } from "@/type/categories"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { categoryService } from "@/services/category"
import { ProductProvider } from "./context/use-products"

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[] | undefined>(undefined)

  useEffect(() => {
    const getCategories = async () => {
      const categories = await categoryService.getCategories()
      setCategories(categories)
    }

    getCategories()
  }, [])

  if (!categories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    )
  }

  return (
    <main className="bg-white">
      <CartProvider>
        <ProductProvider>
          <SiteHeader />
          <div className="max-w-6xl mx-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row gap-6">
                <ProductGrid />
              </div>
            </div>
          </div>
          <SiteFooter />
        </ProductProvider>
      </CartProvider>
    </main>
  )
}
