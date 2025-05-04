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
        setCart((prevCart) =>
          prevCart.map((item) => (item.id === existingProduct.id ? { ...item, quantity: item.quantity + 1 } : item)),
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
          },
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
          description: "Não foi possível adicionar o produto, produto sem estoque.",
        })
      } else {
        toast({
          title: "Erro interno",
          description:
            "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor tente novamente mais tarde.",
        })
      }

      setIsAddingToCart(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col h-full">
      <div className="relative mb-4">
        {isOnPromotion && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {/* Calculando a porcentagem de desconto aproximada */}-
            {Math.round(((product.regularPrice - (product.promotionalPrice || 0)) / product.regularPrice) * 100)}%
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
        >
          <Plus className="h-5 w-5 text-green-600" />
          <span className="sr-only">Adicionar rapidamente</span>
        </Button>
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

        <h3 className="text-sm font-medium mb-1 line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        <div className="mt-auto">
          {isOnPromotion ? (
            <>
              <p className="text-xs text-gray-500 line-through">de R$ {regularPrice.replace(".", ",")}</p>
              <div className="flex items-end gap-1">
                <span className="text-green-600 font-bold text-lg">R$ {displayPrice.replace(".", ",")}</span>
              </div>
            </>
          ) : (
            <div className="flex items-end gap-1">
              <span className="text-green-600 font-bold text-lg">R$ {displayPrice.replace(".", ",")}</span>
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
