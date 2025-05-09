"use client"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetFooter } from "../ui/sheet"
import { useCart } from "@/app/context/cart-context"
import { useItem } from "./hook/use-item"

export const SideMenuCart = () => {
  const { cart, setCart } = useCart()

  const { incrementItem, decrementItem, removeItem } = useItem()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[450px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Seu Carrinho</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {cart.length === 0 ? (
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
            <div className="space-y-4 p-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => decrementItem(item.id)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => incrementItem(item.id)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {((item.regularPrice / 100) * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 h-6 mt-1"
                      onClick={() => removeItem(item.id)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <SheetFooter className="border-t pt-4 mt-auto">
            <div className="w-full space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="font-medium">
                  R$ {cart.reduce((total, item) => total + (item.regularPrice / 100) * item.quantity, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>
                  R$ {cart.reduce((total, item) => total + (item.regularPrice / 100) * item.quantity, 0).toFixed(2)}
                </span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Finalizar Pedido</Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
