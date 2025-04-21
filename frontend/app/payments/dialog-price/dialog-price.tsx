"use client"

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { loadStripe } from "@stripe/stripe-js"
import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { StripeService } from "@/services/stripe"

export const DialogPrice = ({ price }: { price: string }) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "")

  const fetchClientSecret = useCallback(() => StripeService.createCheckout(price), [price])
  const options = { fetchClientSecret }
  console.log(options)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Comprar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] rounded-xl border-green-100 shadow-xl overflow-hidden">
        {/* Gradientes de fundo sutis */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-green-100 to-green-300 opacity-30 blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-gradient-to-tr from-green-100 to-green-300 opacity-30 blur-xl"></div>

        <div className="relative z-10">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
