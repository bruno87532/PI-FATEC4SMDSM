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
    totalItems: products.length,
    itemsPerPage: productsPerPage,
    initialPage: 0,
  })

  const displayedProducts = useMemo(() => {
    const startIndex = currentPage * productsPerPage
    return products.slice(startIndex, startIndex + productsPerPage)
  }, [products, currentPage, productsPerPage])

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="bg-green-50 border border-green-200 outline outline-1 outline-black/20 rounded-full px-3 py-1.5 flex items-center justify-between flex-1 mr-3 shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-green-600 h-5 w-5" />
            <h2 className="text-xl font-bold text-green-700">{market}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="text-green-600 text-sm font-medium hover:underline"
            aria-label={`Ver mais produtos de ${market}`}
          >
            Ver mais
          </a>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full p-0"
              aria-label="Página anterior"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full p-0"
              aria-label="Próxima página"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6" role="navigation" aria-label="Paginação de produtos">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === currentPage ? "bg-green-600" : "bg-gray-300 hover:bg-gray-400"
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
