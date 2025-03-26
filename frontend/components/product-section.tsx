import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Plus } from "lucide-react"

const products = [
    { id: 1, name: "Produto 1", price: "R$ 9,99", image: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Produto 2", price: "R$ 19,99", image: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Produto 3", price: "R$ 29,99", image: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Produto 4", price: "R$ 39,99", image: "/placeholder.svg?height=200&width=200" },
]

export function ProductSection() {
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
                        <Button variant="outline" className="h-8 w-8 rounded-full p-0">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 rounded-full p-0">
                            <ChevronRight className="h-4 w-4" />
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
                        <h3 className="font-medium mb-2">{product.name}</h3>
                        <div className="mt-auto">
                            <div className="text-lg font-bold">{product.price}</div>
                            <Button variant="outline" className="w-full mt-2 border-green-600 text-green-600 hover:bg-green-50">
                                Adicionar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

