"use client"

import type React from "react"
import type { ProductDb } from "@/type/product"
import { usePagination } from "../../hooks/use-pagination"
import { useMemo } from "react"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "../product-card/product-card"

interface ProductMarketProps {
  market: string
  products: ProductDb[]
  productsPerPage: number
}

const ProductMarket: React.FC<ProductMarketProps> = ({ market, products, productsPerPage }) => {
  const { currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination({
    totalitems: products.length,
    itemsPerPage: productsPerPage,
    initialPage: 0,
  })

  const displayedProducts = useMemo(() => {
    const startIndex = currentPage * productsPerPage
    return products.slice(startIndex, startIndex + productsPerPage)
  }, [products, currentPage, productsPerPage])

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingCart className="text-white h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{market}</h2>
            <p className="text-gray-500">Produtos selecionados especialmente para você</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-gray-200 hover:border-green-500 hover:bg-green-50"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-gray-200 hover:border-green-500 hover:bg-green-50"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8" role="navigation" aria-label="Paginação de produtos">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`h-3 w-8 rounded-full transition-all duration-300 ${
                i === currentPage ? "bg-green-600 shadow-lg" : "bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Ir para página ${i + 1}`}
              aria-current={i === currentPage ? "page" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductMarket
