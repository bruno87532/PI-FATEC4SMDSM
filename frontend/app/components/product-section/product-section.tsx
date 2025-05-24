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
    <div className="container mx-auto py-8 max-w-6xl">
      {Object.keys(products).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum produto em destaque disponível no momento.</p>
        </div>
      ) : (
        search === "" ? (
          Object.keys(products).map((plan) =>
            Object.keys(products[plan]).map((market) => (
              <ProductMarket
                key={`${plan}_${market}`}
                market={market}
                products={products[plan][market]}
                productsPerPage={productsPerPage}
              />
            ))
          )
        ) : (
          Object.keys(productsSearch).map((plan) =>
            Object.keys(productsSearch[plan]).map((market) => (
              <ProductMarket
                key={`${plan}_${market}`}
                market={market}
                products={productsSearch[plan][market]}
                productsPerPage={productsPerPage}
              />
            ))
          )
        )
      )}
    </div>
  )

}


