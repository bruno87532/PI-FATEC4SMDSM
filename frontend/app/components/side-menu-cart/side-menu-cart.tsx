"use client"

import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../ui/sheet"
import { useCart } from "@/app/context/cart-context"
import { useItem } from "./hook/use-item"
import { useUser } from "@/app/context/user-context"
import { FormDialog } from "./components/form-dialog/form-dialog"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { StripeService } from "@/services/stripe"
import type { ProductFromCart } from "@/type/product"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export const SideMenuCart = () => {
  const { cart } = useCart()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
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

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const sheetCloseRef = useRef<HTMLButtonElement>(null)

  const { incrementItem, decrementItem, deleteItem } = useItem(setData)

  const handlePurchase = async (totalPrice: number, idUserAdvertiser: string) => {
    if (
      user &&
      (!user.zipCode ||
        !user.state ||
        !user.city ||
        !user.neighborhood ||
        !user.road ||
        !user.marketNumber ||
        !user.phone)
    ) {
      setIsOpen(true)
      return
    }

    try {
      const response = await StripeService.createPurchase(totalPrice, idUserAdvertiser)
      let clientSecretValue = null

      if (typeof response === "string") {
        clientSecretValue = response
      } else if (response && typeof response === "object") {
        clientSecretValue = response.client_secret || response.clientSecret || response.secret
      }

      if (clientSecretValue && typeof clientSecretValue === "string" && clientSecretValue.includes("_secret_")) {
        const cleanClientSecret = clientSecretValue.trim()

        setClientSecret(cleanClientSecret)
        setShowCheckout(true)

        if (sheetCloseRef.current) {
          sheetCloseRef.current.click()
        }
      } 
    } catch (error) {
      console.error(error)
    }
  }

  const closeCheckout = () => {
    setShowCheckout(false)
    setClientSecret(null)
  }

  const isCartEmpty = !cart || Object.values(cart).every((items) => items.length === 0)

  const totalQuantity = Object.values(cart || {}).reduce(
    (total, items) => total + items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  )

  const checkoutOptions =
    clientSecret && clientSecret.includes("_secret_")
      ? {
          clientSecret: clientSecret,
        }
      : null

  const CheckoutModal = () => {
    if (!showCheckout || !checkoutOptions) return null

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Finalizar Pagamento</h2>
            <Button variant="ghost" size="sm" onClick={closeCheckout} className="h-8 w-8 p-0 hover:bg-gray-200">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={checkoutOptions}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {!isCartEmpty && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalQuantity}
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
                <SheetClose asChild ref={sheetCloseRef}>
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
                      {advertiserData.products.map((product) => {
                        const itemId = Object.values(cart || {})
                          .flat()
                          .find((item) => item.idProduct === product.id)?.id

                        return (
                          <div key={product.id} className="flex justify-between items-center border-b pb-3">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <div className="flex items-center mt-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 rounded-full"
                                  onClick={() =>
                                    itemId && (product.quantity === 1 ? deleteItem(itemId) : decrementItem(itemId))
                                  }
                                >
                                  -
                                </Button>
                                <span className="mx-2">{product.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 rounded-full"
                                  onClick={() => itemId && incrementItem(itemId)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                R${" "}
                                {(
                                  ((product.promotionalPrice || product.regularPrice) / 100) *
                                  product.quantity
                                ).toFixed(2)}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 h-6 mt-1"
                                onClick={() => itemId && deleteItem(itemId)}
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 pt-2 border-t">
                      <div className="flex justify-between font-bold text-lg mb-3">
                        <span>Total:</span>
                        <span>R$ {(advertiserData.totalPrice / 100).toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(advertiserData.totalPrice, advertiserData.idUser)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Finalizar Pedido com {advertiserData.advertiserName}
                      </Button>
                    </div>
                  </div>
                ))}
                <SheetClose ref={sheetCloseRef} className="hidden" />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <CheckoutModal />

      <FormDialog setIsOpen={setIsOpen} isOpen={isOpen} onComplete={() => setShowCheckout(true)} />
    </>
  )
}
