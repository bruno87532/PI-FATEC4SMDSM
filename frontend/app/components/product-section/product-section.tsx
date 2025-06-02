"use client"

import { useState, useEffect, useMemo } from "react"
import { HighlightProductsService } from "@/services/highlight-products"
import type { ProductDb } from "@/type/product"
import ProductMarket from "./components/product-market/product-market"
import ProductSectionSkeleton from "./components/product-section-skeleton/product-section-skeleton"
import { CategoryFilters } from "./components/category-filters/category-filters"
import { useSearch } from "@/app/context/search-context"
import { useCategory } from "@/app/context/category-context"

export const ProductSection = () => {
  const [products, setProducts] = useState<
    Record<string, Record<string, ProductDb[]>>
  >({})
  const [isLoading, setIsLoading] = useState(true)

  const { search } = useSearch()
  const { selectedCategoryIds, selectedSubcategoryIds } = useCategory()

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

  const filteredProducts = useMemo(() => {
    if (isLoading) {
      return {}
    }

    const result: Record<string, Record<string, ProductDb[]>> = {}

    for (const planKey of Object.keys(products)) {
      for (const marketKey of Object.keys(products[planKey])) {
        const originalList = products[planKey][marketKey]

        const filteredList = originalList.filter((product) => {
          const nameLower = product.name.toLowerCase()
          const matchesSearch =
            search === "" || nameLower.includes(search.toLowerCase())

          if (!matchesSearch) {
            return false
          }

          if (
            selectedCategoryIds.length === 0 &&
            selectedSubcategoryIds.length === 0
          ) {
            return true
          }

          const prodCatIds = product.categorys.map((c) => c.id)
          const prodSubIds = product.subCategorys.map((s) => s.id)

          const hasMatchingCategory = selectedCategoryIds.some((selId) =>
            prodCatIds.includes(selId)
          )
          const hasMatchingSubcategory = selectedSubcategoryIds.some((selId) =>
            prodSubIds.includes(selId)
          )

          return hasMatchingCategory || hasMatchingSubcategory
        })

        if (filteredList.length > 0) {
          if (!result[planKey]) {
            result[planKey] = {}
          }
          result[planKey][marketKey] = filteredList
        }
      }
    }

    return result
  }, [
    products,
    isLoading,
    search,
    selectedCategoryIds,
    selectedSubcategoryIds,
  ])

  if (isLoading) {
    return <ProductSectionSkeleton />
  }

  const noProducts =
    Object.keys(filteredProducts).length === 0 ||
    Object.values(filteredProducts).every(
      (markets) => Object.keys(markets).length === 0
    )

  if (noProducts) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <CategoryFilters />
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <p className="text-xl text-gray-500 mb-2">
              Nenhum produto encontrado para os filtros aplicados.
            </p>
            <p className="text-gray-400">
              Ajuste sua busca ou filtros e tente novamente!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra os melhores produtos dos mercados parceiros com preços especiais
          </p>
        </div>

        <CategoryFilters />

        <div className="space-y-16">
          {Object.keys(filteredProducts).map((plan) =>
            Object.keys(filteredProducts[plan]).map((market) => (
              <ProductMarket
                key={`${plan}_${market}`}
                market={market}
                products={filteredProducts[plan][market]}
                productsPerPage={productsPerPage}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
