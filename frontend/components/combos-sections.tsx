import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Plus } from 'lucide-react'

const products = [
    {
        id: 1,
        name: "Café em Cápsula Compatível com Nespresso Nescafé Farmers Origins",
        price: "R$ 23,98",
        image: "/placeholder.svg?height=200&width=200",
        rating: 5
    },
    {
        id: 2,
        name: "Maionese Hellmann's Churrasco 335g",
        price: "R$ 12,69",
        image: "/placeholder.svg?height=200&width=200",
        rating: 3
    },
    {
        id: 3,
        name: "Salgadinho Club Social Parmesão 115g",
        price: "R$ 9,99",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4
    },
    {
        id: 4,
        name: "Alimento para Cães Champ Adulto Frango 85g",
        price: "R$ 2,39",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4
    },
];

export function CombosSection() {
    return (
        <div className="container mx-auto py-8">
            {/* Banner Combos Especiais */}
            <div className="relative mb-6">
                <div className="flex items-center">
                    <div className="ml-4 bg-gradient-to-r from-yellow-300 to-green-400 rounded-full py-2 px-8 flex-grow">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-800">
                            Combos especiais
                        </h2>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Mercado XXXX</h2>
                </div>
                <div className="flex items-center gap-2">
                    <a href="#" className="text-green-600 text-sm font-medium">Ver mais</a>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-8 w-8 rounded-full p-0 border-green-600">
                            <ChevronLeft className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 rounded-full p-0 border-green-600">
                            <ChevronRight className="h-4 w-4 text-green-600" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 flex flex-col">
                        <div className="relative mb-4">
                            <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="object-contain mx-auto"
                            />
                            <Button variant="ghost" className="absolute top-0 right-0 h-8 w-8 p-0">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-sm ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                        </div>
                        <h3 className="font-medium mb-2 text-sm line-clamp-2">{product.name}</h3>
                        <div className="mt-auto">
                            <div className="text-lg font-bold text-green-700">{product.price}</div>
                            <Button className="w-full mt-2 bg-white border border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                Adicionar ao carrinho
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-green-600' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}