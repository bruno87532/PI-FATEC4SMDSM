"use client"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../ui/sheet"
import { useCart } from "@/app/context/cart-context"
import { useItem } from "./hook/use-item"
import { useState } from "react"
import type { ProductFromCart } from "@/type/product"

export const SideMenuCart = () => {
  const { cart, setCart } = useCart()
  const [data, setData] = useState<
    Record<
      string,
      {
        idUser: string
        advertiserName: string
        products: Array<ProductFromCart>
        totalPrice: number
      }
    >
  >({})
  const { incrementItem, decrementItem, createItem, deleteItem } = useItem(setData)

  // Verificar se o carrinho está vazio
  const isCartEmpty = !cart || Object.values(cart).every((items) => items.length === 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {!isCartEmpty && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.values(cart || {}).reduce(
                (total, items) => total + items.reduce((sum, item) => sum + item.quantity, 0),
                0,
              )}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[450px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Seu Carrinho</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {isCartEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <SheetClose asChild>
                <Button variant="link" className="mt-4">
                  Continuar comprando
                </Button>
              </SheetClose>
            </div>
          ) : (
            <div className="space-y-8 p-1">
              {Object.entries(data).map(([idUser, advertiserData]) => (
                <div key={idUser} className="border rounded-lg p-4">
                  <div className="font-medium text-lg border-b pb-2 mb-3">{advertiserData.advertiserName}</div>

                  <div className="space-y-4">
                    {advertiserData.products.map((product) => (
                      <div key={product.id} className="flex justify-between items-center border-b pb-3">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center mt-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => {
                                // Encontrar o item no carrinho que corresponde a este produto
                                const itemId = Object.values(cart || {})
                                  .flat()
                                  .find((item) => item.idProduct === product.id)?.id

                                if (itemId) decrementItem(itemId)
                              }}
                            >
                              -
                            </Button>
                            <span className="mx-2">{product.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => {
                                // Encontrar o item no carrinho que corresponde a este produto
                                const itemId = Object.values(cart || {})
                                  .flat()
                                  .find((item) => item.idProduct === product.id)?.id

                                if (itemId) incrementItem(itemId)
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            R${" "}
                            {(((product.promotionalPrice || product.regularPrice) / 100) * product.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-6 mt-1"
                            onClick={() => {
                              // Encontrar o item no carrinho que corresponde a este produto
                              const itemId = Object.values(cart || {})
                                .flat()
                                .find((item) => item.idProduct === product.id)?.id

                              if (itemId) deleteItem(itemId)
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-2 border-t">
                    <div className="flex justify-between font-bold text-lg mb-3">
                      <span>Total:</span>
                      <span>R$ {(advertiserData.totalPrice / 100).toFixed(2)}</span>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Finalizar Pedido com {advertiserData.advertiserName}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
