"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HighlightProductsService } from "@/services/highlight-products"
import { useToast } from "@/hooks/use-toast"
import type { ProductDb } from "@/type/product"
import { ProductCard } from "./components/product-card"
import { usePagination } from "./hooks/use-pagination"

export function ProductSection() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Record<string, Record<string, ProductDb[]>>>({})
  const [isLoading, setIsLoading] = useState(true)

  const productsPerPage = 4

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const fetchedProducts = await HighlightProductsService.featuredProductsHome()
        setProducts(fetchedProducts)
      } catch (error) {
        toast({
          title: "Erro interno",
          description: "Devido a problemas técnicos, não foi possível prosseguir com sua requisição. Por favor, tente novamente mais tarde."
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

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
            <ProductCategory
              key={`${plan}_${market}`}
              plan={plan}
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

function ProductCategory({
  plan,
  market,
  products,
  productsPerPage,
}: {
  plan: string
  market: string
  products: ProductDb[]
  productsPerPage: number
}) {
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
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-gray-600" />
          <h2 className="text-xl font-bold">{market}</h2>
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
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i === currentPage ? "bg-green-600" : "bg-gray-300 hover:bg-gray-400"
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

function ProductSectionSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 h-72">
              <div className="h-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
