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
import type { Item } from "@/type/item"
import { useUser } from "@/app/context/user-context"
import { useIsLoginOpen } from "@/app/context/is-login-open"

export const ProductCard: React.FC<{ product: ProductDb }> = ({ product }) => {
  const { user, setUser } = useUser()
  const { isLoginOpen, setIsLoginOpen } = useIsLoginOpen()
  const { cart, setCart } = useCart()
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const now = new Date()
  const isOnPromotion =
    product.promotionExpiration &&
    product.promotionalPrice &&
    product.promotionStart &&
    new Date(product.promotionExpiration).getTime() > now.getTime() &&
    new Date().getTime() > new Date(product.promotionStart).getTime()

  const displayPrice = isOnPromotion
    ? (product.promotionalPrice! / 100).toFixed(2)
    : (product.regularPrice / 100).toFixed(2)

  const regularPrice = (product.regularPrice / 100).toFixed(2)

  const addToCart = async () => {
    if (!user) {
      setIsLoginOpen(true)
      return
    }
    setIsAddingToCart(true)
    try {
      const currentCart: Record<string, Item[]> = cart ?? {}

      let existingItem: Item | undefined = undefined
      let existingCartId: string | undefined = undefined

      for (const [cartId, items] of Object.entries(currentCart)) {
        const found = items.find((i) => i.idProduct === product.id)
        if (found) {
          existingItem = found
          existingCartId = cartId
          break
        }
      }

      if (existingItem && existingCartId) {
        await itemService.incrementItem(existingItem.id)

        setCart((prev) => {
          if (!prev) return prev
          const updated = { ...prev }
          updated[existingCartId!] = updated[existingCartId!].map((i) =>
            i.id === existingItem!.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
          return updated
        })
      } else {
        const newItem = await itemService.createItem(product.id)

        setCart((prev) => {
          const updated = prev ? { ...prev } : {}
          if (updated[newItem.idCart]) {
            updated[newItem.idCart] = [...updated[newItem.idCart], newItem]
          } else {
            updated[newItem.idCart] = [newItem]
          }
          return updated
        })
      }

      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho.`,
      })
    } catch (error) {
      if (error instanceof ApiError && error.message === "Product out of stock") {
        toast({
          title: "Produto fora de estoque",
          description:
            "Não foi possível adicionar o produto, produto sem estoque.",
        })
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col h-full">
      <div className="relative mb-4">
        {isOnPromotion && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(
              ((product.regularPrice - (product.promotionalPrice || 0)) /
                product.regularPrice) *
              100
            )}
            %
          </div>
        )}
        <div className="flex justify-center">
          <Image
            src={`https://drive.google.com/uc?export=view&id=${product.idDrive}`}
            alt={product.name}
            width={150}
            height={150}
            className="object-contain h-[150px]"
            loading="lazy"
          />
        </div>
        <Button
          variant="ghost"
          className="absolute top-0 right-0 p-1 bg-white rounded-full border h-8 w-8 flex items-center justify-center"
          aria-label={`Adicionar ${product.name} rapidamente ao carrinho`}
          onClick={addToCart}
          disabled={isAddingToCart}
        >
          <Plus className="h-5 w-5 text-green-600" />
          <span className="sr-only">Adicionar rapidamente</span>
        </Button>
      </div>

      <div className="flex flex-col flex-grow">
        <h3
          className="text-sm font-medium mb-1 line-clamp-2"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="mt-auto">
          {isOnPromotion ? (
            <>
              <p className="text-xs text-gray-500 line-through">
                de R$ {regularPrice.replace(".", ",")}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-green-600 font-bold text-lg">
                  R$ {displayPrice.replace(".", ",")}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-end gap-1">
              <span className="text-green-600 font-bold text-lg">
                R$ {displayPrice.replace(".", ",")}
              </span>
            </div>
          )}

          <Button
            className="mt-2 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
            onClick={addToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              "Adicionando..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>Adicionar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
