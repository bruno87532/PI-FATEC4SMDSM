"use client"

import ProductSectionSkeleton from "@/app/components/product-section/components/product-section-skeleton/product-section-skeleton"
import ProductMarket from "@/app/components/product-section/components/product-market/product-market"
import { useProduct } from "../context/use-products"

export function ProductGrid() {
  const { products, isLoading } = useProduct()

  const productsPerPage = 4

  if (isLoading || !products) {
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
