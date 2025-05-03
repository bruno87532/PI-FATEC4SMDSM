"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Plus } from "lucide-react"

// Types for products
type Product = {
    id: number
    name: string
    price: number
    originalPrice?: number
    discount?: number
    image: string
    unit?: string
    pricePerUnit?: string
    market: string
}

// Sample product data
const sampleProducts: Product[] = [
    {
        id: 1,
        name: "Liza Soybean Oil 900ml",
        price: 6.48,
        originalPrice: 8.99,
        discount: 28,
        image: "/placeholder.svg?height=200&width=200",
        market: "Covabra",
    },
    {
        id: 2,
        name: "Shefa Whole Milk 1l",
        price: 3.79,
        unit: "unit",
        image: "/placeholder.svg?height=200&width=200",
        market: "Covabra",
    },
    {
        id: 3,
        name: "Broto Legal Carioca Beans 1kg",
        price: 6.99,
        originalPrice: 8.99,
        discount: 22,
        pricePerUnit: "(R$ 6.99/KG)",
        image: "/placeholder.svg?height=200&width=200",
        market: "Covabra",
    },
    {
        id: 4,
        name: "Qualy Margarine with Salt 500g",
        price: 7.49,
        originalPrice: 9.79,
        discount: 23,
        image: "/placeholder.svg?height=200&width=200",
        market: "Covabra",
    },
    {
        id: 5,
        name: "Danone Strawberry Yogurt 900g",
        price: 13.99,
        originalPrice: 16.99,
        discount: 18,
        image: "/placeholder.svg?height=200&width=200",
        market: "Covabra",
    },
    {
        id: 6,
        name: "Neve Double Ply Toilet Paper 30m",
        price: 27.9,
        originalPrice: 39.9,
        discount: 30,
        image: "/placeholder.svg?height=200&width=200",
        market: "Covabra",
    },
    {
        id: 7,
        name: "Tio João Rice 5kg",
        price: 24.9,
        originalPrice: 29.9,
        discount: 17,
        image: "/placeholder.svg?height=200&width=200",
        market: "Pão de Açúcar",
    },
    {
        id: 8,
        name: "Pilão Ground Coffee 500g",
        price: 15.99,
        originalPrice: 19.99,
        discount: 20,
        image: "/placeholder.svg?height=200&width=200",
        market: "Carrefour",
    },
]

// Individual product component
const ProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="border rounded-lg p-4 flex flex-col h-full">
            <div className="relative mb-4">
                {product.discount && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                    </div>
                )}
                <div className="flex justify-center">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="object-contain h-[150px]"
                    />
                </div>
                <button className="absolute top-0 right-0 p-1 bg-white rounded-full border">
                    <Plus className="h-5 w-5 text-green-600" />
                </button>
            </div>

            <div className="flex flex-col flex-grow">
                <div className="flex items-center mb-1">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className="w-4 h-4 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                        ))}
                    </div>
                </div>

                <h3 className="text-sm font-medium mb-1">{product.name}</h3>

                {product.unit && (
                    <p className="text-xs text-gray-500 mb-1">
                        R$ {product.price.toFixed(2).replace(".", ",")} per {product.unit}
                    </p>
                )}

                <div className="mt-auto">
                    {product.originalPrice && (
                        <p className="text-xs text-gray-500 line-through">
                            from R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                        </p>
                    )}

                    <div className="flex items-end gap-1">
                        <span className="text-green-600 font-bold text-lg">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                        {product.pricePerUnit && <span className="text-xs text-gray-500">{product.pricePerUnit}</span>}
                    </div>

                    <button className="mt-2 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to cart</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export function ProductGrid() {
    const [sortOption, setSortOption] = useState("best-sellers")
    const [products] = useState(sampleProducts)

    return (
        <div className="flex-1">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Products
                            <ShoppingCart className="h-6 w-6" />
                        </h1>
                        <p className="text-gray-600">{products.length} products found</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Sort by:</span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border rounded-md p-2 text-sm"
                        >
                            <option value="best-sellers">Best Sellers</option>
                            <option value="lowest-price">Lowest Price</option>
                            <option value="highest-price">Highest Price</option>
                            <option value="a-z">A-Z</option>
                            <option value="z-a">Z-A</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
