"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react"

// Lista completa de produtos
const allProducts = [
    {
        id: 1,
        name: "Café em Cápsula Compatível com Nespresso Nescafé Farmers Origins",
        price: "R$ 23,98",
        image: "/placeholder.svg?height=200&width=200",
        rating: 5,
    },
    {
        id: 2,
        name: "Maionese Hellmann's Churrasco 335g",
        price: "R$ 12,69",
        image: "/placeholder.svg?height=200&width=200",
        rating: 3,
    },
    {
        id: 3,
        name: "Salgadinho Club Social Parmesão 115g",
        price: "R$ 9,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4,
    },
    {
        id: 4,
        name: "Alimento para Cães Champ Adulto Frango 85g",
        price: "R$ 2,39",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4,
    },
    // Adicionando mais produtos para ter múltiplas páginas
    {
        id: 5,
        name: "Chocolate ao Leite Lacta 90g",
        price: "R$ 6,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 5,
    },
    {
        id: 6,
        name: "Refrigerante Coca-Cola 2L",
        price: "R$ 9,49",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4,
    },
    {
        id: 7,
        name: "Biscoito Recheado Oreo 90g",
        price: "R$ 3,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 5,
    },
    {
        id: 8,
        name: "Arroz Tio João 1kg",
        price: "R$ 7,29",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4,
    },
    {
        id: 9,
        name: "Feijão Carioca Camil 1kg",
        price: "R$ 8,49",
        image: "/placeholder.svg?height=200&width=200",
        rating: 3,
    },
    {
        id: 10,
        name: "Azeite de Oliva Extra Virgem Gallo 500ml",
        price: "R$ 29,90",
        image: "/placeholder.svg?height=200&width=200",
        rating: 5,
    },
    {
        id: 11,
        name: "Leite Integral Itambé 1L",
        price: "R$ 4,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4,
    },
    {
        id: 12,
        name: "Papel Higiênico Neve 12 rolos",
        price: "R$ 19,90",
        image: "/placeholder.svg?height=200&width=200",
        rating: 5,
    },
    {
        id: 13,
        name: "Sabão em Pó Omo 1kg",
        price: "R$ 15,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4,
    },
    {
        id: 14,
        name: "Detergente Ypê 500ml",
        price: "R$ 2,79",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4,
    },
    {
        id: 15,
        name: "Água Mineral Crystal 500ml",
        price: "R$ 1,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 3,
    },
    {
        id: 16,
        name: "Cerveja Heineken 350ml",
        price: "R$ 4,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 5,
    },
]

export function CombosSection() {
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

    // Função para ir para uma página específica
    const goToPage = useCallback((pageIndex: number) => {
        setCurrentPage(pageIndex)
    }, [])

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

        // Mostrar notificação usando alert em vez de toast
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
        }, 8000) // Muda a página a cada 8 segundos

        return () => clearInterval(interval)
    }, [nextPage])

    // Produtos da página atual
    const currentProducts = getCurrentPageProducts()

    return (
        <div className="container mx-auto py-8 max-w-6xl">
            {/* Banner Combos Especiais */}
            <div className="relative mb-6">
                <div className="flex items-center">
                    <div className="ml-4 bg-gradient-to-r from-yellow-300 to-green-400 rounded-full py-2 px-8 flex-grow">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-800">Combos especiais</h2>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Mercado XXXX</h2>
                </div>
                <div className="flex items-center gap-2">
                    <a href="#" className="text-green-600 text-sm font-medium">
                        Ver mais
                    </a>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0 border-green-600"
                            onClick={prevPage}
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0 border-green-600"
                            onClick={nextPage}
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="h-4 w-4 text-green-600" />
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
                        <div className="flex mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-sm ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <h3 className="font-medium mb-2 text-sm line-clamp-2">{product.name}</h3>
                        <div className="mt-auto">
                            <div className="text-lg font-bold text-green-700">{product.price}</div>
                            <Button
                                className="w-full mt-2 bg-white border border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center gap-2"
                                onClick={() => addToCart(product.id)}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Adicionar ao carrinho
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${i === currentPage ? "bg-green-600" : "bg-gray-300"}`}
                        aria-label={`Ir para página ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
