"use client"

import { ApiError } from "@/type/error"
import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductDb } from "@/type/product"
import { useCart } from "@/app/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { itemService } from "@/services/item"

export const ProductCard: React.FC<{ product: ProductDb }> = ({ product }) => {
  const { cart, setCart } = useCart()
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const now = new Date()
  const isOnPromotion =
    product.promotionExpiration &&
    product.promotionalPrice &&
    new Date(product.promotionExpiration).getTime() > now.getTime()


  const displayPrice = isOnPromotion
    ? (product.promotionalPrice! / 100).toFixed(2)
    : (product.regularPrice / 100).toFixed(2)

  const regularPrice = (product.regularPrice / 100).toFixed(2)

  const addToCart = async () => {
    try {
      setIsAddingToCart(true)
      const existingProduct = cart.find((item) => item.idProduct === product.id)

      if (!!existingProduct) {
        await itemService.incrementItem(existingProduct.id)
        setCart((prevCart) => prevCart
          .map((item) => item.id === existingProduct.id ? { ...item, quantity: item.quantity + 1 } : item)
        )
      } else {
        const item = await itemService.createItem(product.id)
        setCart((prevCart) => [
          ...prevCart,
          {
            id: item.id,
            idProduct: item.idProduct,
            quantity: 1,
            unitPrice: item.unitPrice,
            name: product.name,
            regularPrice: product.regularPrice,
          }
        ])
      }
      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho.`,
      })

      setIsAddingToCart(false)
    } catch (error) {
      if (error instanceof ApiError && error.message === "Product out of stock") {
        toast({
          title: "Produto fora de estoque",
          description: "Não foi possível adicionar o produto, produto sem estoque."
        })
      } else {
        toast({
          title: "Erro interno",
          description: "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor tente novamente mais tarde."
        })
      }

      setIsAddingToCart(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="relative mb-4 flex-shrink-0">
        <div className="h-40 flex items-center justify-center">
          <Image
            src={`https://drive.google.com/uc?export=view&id=${product.idDrive}`}
            alt={product.name}
            width={200}
            height={200}
            className="object-contain max-h-40"
            loading="lazy"
          />
        </div>
        <Button
          variant="ghost"
          className="absolute top-0 right-0 h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          aria-label={`Adicionar ${product.name} rapidamente ao carrinho`}
          onClick={addToCart}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Adicionar rapidamente</span>
        </Button>
      </div>

      <h3 className="font-medium mb-2 text-sm line-clamp-2 flex-grow" title={product.name}>
        {product.name}
      </h3>

      <div className="mt-auto">
        <div className="mb-2">
          {isOnPromotion ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 line-through">R$ {regularPrice}</span>
              <span className="text-lg font-bold text-green-700">R$ {displayPrice}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-green-700">R$ {displayPrice}</span>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full border-green-600 text-green-600 hover:bg-green-50 transition-colors"
          onClick={addToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? "Adicionando..." : "Adicionar"}
        </Button>
      </div>
    </div>
  )
}
