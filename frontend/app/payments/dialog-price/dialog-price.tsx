"use client"

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { loadStripe } from "@stripe/stripe-js"
import { useCallback, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StripeService } from "@/services/stripe"
import { AlertTriangle } from "lucide-react"
import { subscriptionService } from "@/services/subscription"

export const DialogPrice = ({ price }: { price: string }) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "")
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSubscriptionActivate, setIsSubscriptionActivate] = useState<boolean>(false)

  const fetchClientSecret = useCallback(() => StripeService.createCheckout(price), [price])
  const options = { fetchClientSecret }

  useEffect(() => {
    const getSubscriptionActiveByIdUser = async () => {
      try {
        await subscriptionService.getSubscriptionActiveByIdUser()
        setIsSubscriptionActivate(true)
      } catch (error) {
        setIsSubscriptionActivate(false)
      }
    }

    getSubscriptionActiveByIdUser()
  }, [])

  const handleOpenChange = () => {
    setIsOpen(!isOpen)

    if (isOpen === false) setShowCheckout(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Comprar</Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border-green-100 shadow-xl overflow-hidden">

        <div className="relative z-10">
          {!showCheckout && isSubscriptionActivate ? (
            <>
              <DialogTitle className="text-xl font-bold text-green-700 flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                Atenção
              </DialogTitle>

              <div className="">
                <div className="flex flex-col justify-center gap-2 sm:justify-center">
                  <DialogDescription>
                    Se continuar com a compra sua assinatura será cancelada imediatamente.
                    <p className="mt-2 font-medium">Você perderá todos os benefícios da assinatura atual.</p>
                  </DialogDescription>
                  <div className="flex flex-row justify-center gap-4 mt-2">
                    <Button variant="outline" className="border-green-600 text-green-600"
                      onClick={handleOpenChange}
                    >
                      Voltar
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setShowCheckout(!showCheckout)}
                    >
                      Confirmar cancelamento
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogTitle className="text-xl font-bold text-green-700 mb-4">Anuncie na nossa plataforma</DialogTitle>

              <div className="max-h-[60vh] overflow-y-auto bg-white rounded-lg">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                  <EmbeddedCheckout className="max-h-[60vh]" />
                </EmbeddedCheckoutProvider>
              </div>

              <DialogFooter className="mt-4 pt-4 border-t border-green-100">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors rounded-full"
                  >
                    Cancelar pagamento
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
