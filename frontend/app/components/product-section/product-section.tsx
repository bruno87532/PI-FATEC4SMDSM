"use client"

import { useState, useEffect } from "react"
import { HighlightProductsService } from "@/services/highlight-products"
import { useToast } from "@/hooks/use-toast"
import type { ProductDb } from "@/type/product"
import ProductMarket from "./components/product-market/product-market"
import ProductSectionSkeleton from "./components/product-section-skeleton/product-section-skeleton"

export const ProductSection = () => {
  const {toast} = useToast()
  const [products, setProducts] = useState<Record<string, Record<string, ProductDb[]>>>({})
  const [isLoading, setIsLoading] = useState(true)

  const productsPerPage = 4

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const fetchedProducts = await HighlightProductsService.featuredProductsHome()
        setProducts(fetchedProducts)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Erro interno.",
          description: "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor, tente novamente mais tarde."
        });
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
  }, [products])

  if (isLoading) {
    return <ProductSectionSkeleton />
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {Object.keys(products).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum produto em destaque disponível no momento.</p>
        </div>
      ) : (
        Object.keys(products).map((plan) =>
          Object.keys(products[plan]).map((market) => (
            <ProductMarket
              key={`${plan}_${market}`}
              market={market}
              products={products[plan][market]}
              productsPerPage={productsPerPage}
            />
          )),
        )
      )}
    </div>
  )
}


