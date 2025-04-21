"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Plus } from "lucide-react"

// Lista expandida de produtos para ter múltiplas páginas
const allProducts = [
    { id: 1, name: "Vitamina C 1000mg 60 cápsulas", price: "R$ 39,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Whey Protein Concentrado 900g", price: "R$ 89,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Colágeno Hidrolisado 30 sachês", price: "R$ 69,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Ômega 3 1000mg 120 cápsulas", price: "R$ 49,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 5, name: "Multivitamínico 60 comprimidos", price: "R$ 45,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 6, name: "Proteína Vegana 500g", price: "R$ 79,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 7, name: "Magnésio Dimalato 60 cápsulas", price: "R$ 35,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 8, name: "Creatina Monohidratada 300g", price: "R$ 89,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 9, name: "Óleo de Coco Extra Virgem 500ml", price: "R$ 39,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 10, name: "Vitamina D3 2000UI 60 cápsulas", price: "R$ 29,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 11, name: "BCAA 2:1:1 60 cápsulas", price: "R$ 49,90", image: "/placeholder.svg?height=200&width=200" },
    { id: 12, name: "Melatonina 10mg 60 comprimidos", price: "R$ 39,90", image: "/placeholder.svg?height=200&width=200" },
]

export function ProductSection() {
    const [currentPage, setCurrentPage] = useState(0)
    const [cart, setCart] = useState<{ id: number; quantity: number }[]>([])
    const productsPerPage = 4
    const totalPages = Math.ceil(allProducts.length / productsPerPage)

    // Obter produtos para a página atual
    const getCurrentPageProducts = useCallback(() => {
        const startIndex = currentPage * productsPerPage
        return allProducts.slice(startIndex, startIndex + productsPerPage)
    }, [currentPage])

    // Função para ir para a próxima página
    const nextPage = useCallback(() => {
        setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
    }, [totalPages])

    // Função para ir para a página anterior
    const prevPage = useCallback(() => {
        setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
    }, [totalPages])

    // Função para adicionar produto ao carrinho
    const addToCart = useCallback((productId: number) => {
        setCart((prev) => {
            // Verificar se o produto já está no carrinho
            const existingItem = prev.find((item) => item.id === productId)

            if (existingItem) {
                // Aumentar a quantidade se já estiver no carrinho
                return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
            } else {
                // Adicionar novo item ao carrinho
                return [...prev, { id: productId, quantity: 1 }]
            }
        })

        // Mostrar notificação usando alert
        const product = allProducts.find((p) => p.id === productId)
        alert(`${product?.name} foi adicionado ao carrinho`)
    }, [])

    // Função para adicionar rapidamente com o botão +
    const quickAdd = useCallback(
        (productId: number) => {
            addToCart(productId)
        },
        [addToCart],
    )

    // Auto-navegação do carrossel
    useEffect(() => {
        const interval = setInterval(() => {
            nextPage()
        }, 6000) // Muda a página a cada 6 segundos

        return () => clearInterval(interval)
    }, [nextPage])

    // Produtos da página atual
    const currentProducts = getCurrentPageProducts()

    return (
        <div className="container mx-auto py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="text-gray-600" />
                    <h2 className="text-xl font-bold">Ofertas Bem Estar</h2>
                </div>
                <div className="flex items-center gap-2">
                    <a href="#" className="text-green-600 text-sm font-medium">
                        Ver mais
                    </a>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0"
                            onClick={prevPage}
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0"
                            onClick={nextPage}
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 flex flex-col">
                        <div className="relative mb-4">
                            <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="object-contain mx-auto"
                            />
                            <Button
                                variant="ghost"
                                className="absolute top-0 right-0 h-8 w-8 p-0"
                                onClick={() => quickAdd(product.id)}
                                aria-label="Adicionar rapidamente"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                        <h3 className="font-medium mb-2 text-sm line-clamp-2">{product.name}</h3>
                        <div className="mt-auto">
                            <div className="text-lg font-bold text-green-700">{product.price}</div>
                            <Button
                                variant="outline"
                                className="w-full mt-2 border-green-600 text-green-600 hover:bg-green-50"
                                onClick={() => addToCart(product.id)}
                            >
                                Adicionar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicadores de página */}
            <div className="flex justify-center gap-1 mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${i === currentPage ? "bg-green-600" : "bg-gray-300"}`}
                        aria-label={`Ir para página ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
