"use client"

import ProductSectionSkeleton from "@/app/components/product-section/components/product-section-skeleton/product-section-skeleton"
import ProductMarket from "@/app/components/product-section/components/product-market/product-market"
import { useProduct } from "../context/use-products"
import { useSearch } from "@/app/context/search-context"
import { useEffect, useState } from "react"
import { ProductDb } from "@/type/product"
import { HighlightProductsService } from "@/services/highlight-products"

export function ProductGrid() {
  const [productsSearch, setProductsSearch] = useState<Record<string, Record<string, ProductDb[]>>>({})
  const { products, isLoading } = useProduct()
  const { search, setSearch } = useSearch()

  const productsPerPage = 4

  useEffect(() => {
    const handleSearchChange = async () => {
      if (search === "") return
      const fetchedProducts = await HighlightProductsService.featuredProductsPageByPartialName(search)
      setProductsSearch(fetchedProducts)
    }

    handleSearchChange()
  }, [search])

  if (isLoading || !products) {
    return <ProductSectionSkeleton />
  }


  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {Object.keys(products).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum produto em destaque disponível no momento.</p>
        </div>
      ) : search === "" ? (
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

      )}
    </div>
  );

}
