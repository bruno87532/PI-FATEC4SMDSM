"use client"

import { useMemo } from "react"
import ProductSectionSkeleton from "@/app/components/product-section/components/product-section-skeleton/product-section-skeleton"
import ProductMarket from "@/app/components/product-section/components/product-market/product-market"
import { useProduct } from "../context/use-products"
import { useSearch } from "@/app/context/search-context"
import { ProductDb } from "@/type/product"
import { useCategory } from "@/app/context/category-context"
import { CategoryFilters } from "@/app/components/product-section/components/category-filters/category-filters"

export function ProductGrid() {
  const { products, isLoading } = useProduct()
  const { search } = useSearch()
  const { selectedCategoryIds, selectedSubcategoryIds } = useCategory()

  const productsPerPage = 4
  const searchLower = search.toLowerCase()

  const filteredProducts = useMemo(() => {
    if (isLoading || !products) return {}

    const noNameFilter = search === ""
    const noCategoryFilter =
      selectedCategoryIds.length === 0 && selectedSubcategoryIds.length === 0

    if (noNameFilter && noCategoryFilter) {
      return products
    }

    const result: Record<string, Record<string, ProductDb[]>> = {}

    for (const planKey of Object.keys(products)) {
      for (const marketKey of Object.keys(products[planKey])) {
        const originalList = products[planKey][marketKey]

        const filteredList = originalList.filter((product) => {
          const matchesName =
            noNameFilter || product.name.toLowerCase().includes(searchLower)
          if (!matchesName) {
            return false
          }

          if (noCategoryFilter) {
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
    searchLower,
    selectedCategoryIds,
    selectedSubcategoryIds,
  ])

  if (isLoading || !products) {
    return <ProductSectionSkeleton />
  }

  const noResults =
    Object.keys(filteredProducts).length === 0 ||
    Object.values(filteredProducts).every(
      (markets) => Object.keys(markets).length === 0
    )

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <CategoryFilters />

      {noResults ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Nenhum produto encontrado para os critérios informados.
          </p>
        </div>
      ) : (
        Object.keys(filteredProducts).map((plan) =>
          Object.keys(filteredProducts[plan]).map((market) => (
            <ProductMarket
              key={`${plan}_${market}`}
              market={market}
              products={filteredProducts[plan][market]}
              productsPerPage={productsPerPage}
            />
          ))
        )
      )}
    </div>
  )
}
