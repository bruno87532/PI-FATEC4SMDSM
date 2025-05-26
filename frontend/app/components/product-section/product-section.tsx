"use client"

import { useState, useEffect } from "react"
import { HighlightProductsService } from "@/services/highlight-products"
import type { ProductDb } from "@/type/product"
import ProductMarket from "./components/product-market/product-market"
import ProductSectionSkeleton from "./components/product-section-skeleton/product-section-skeleton"
import { useSearch } from "@/app/context/search-context"

export const ProductSection = () => {
  const [products, setProducts] = useState<Record<string, Record<string, ProductDb[]>>>({})
  const [productsSearch, setProductsSearch] = useState<Record<string, Record<string, ProductDb[]>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { search, setSearch } = useSearch()

  const productsPerPage = 4

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const fetchedProducts = await HighlightProductsService.featuredProductsHome()
      setIsLoading(false)
      if (!fetchedProducts) return
      setProducts(fetchedProducts)
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const getProductsByPartialName = async () => {
      if (search === "") return
      const searchProducts = await HighlightProductsService.featuredProductsHomeByPartialName(search)
      console.log(searchProducts)
      setProductsSearch(searchProducts)
    }

    getProductsByPartialName()
  }, [search])

  if (isLoading) {
    return <ProductSectionSkeleton />
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra os melhores produtos dos mercados parceiros com preços especiais
          </p>
        </div>

        {Object.keys(products).length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <p className="text-xl text-gray-500 mb-2">Nenhum produto em destaque</p>
            <p className="text-gray-400">Volte em breve para ver nossas ofertas!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {search === ""
              ? Object.keys(products).map((plan) =>
                  Object.keys(products[plan]).map((market) => (
                    <ProductMarket
                      key={`${plan}_${market}`}
                      market={market}
                      products={products[plan][market]}
                      productsPerPage={productsPerPage}
                    />
                  )),
                )
              : Object.keys(productsSearch).map((plan) =>
                  Object.keys(productsSearch[plan]).map((market) => (
                    <ProductMarket
                      key={`${plan}_${market}`}
                      market={market}
                      products={productsSearch[plan][market]}
                      productsPerPage={productsPerPage}
                    />
                  )),
                )}
          </div>
        )}
      </div>
    </div>
  )
}
