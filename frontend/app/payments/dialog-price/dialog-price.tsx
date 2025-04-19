import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { loadStripe } from "@stripe/stripe-js";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { StripeService } from "@/services/stripe";

export const DialogPrice = ({ price }: { price: string }) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ""
  )
  
  const fetchClientSecret = useCallback(() => StripeService.createCheckout(price), [])
  const options = { fetchClientSecret }
  console.log(options)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Comprar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Anuncie na nossa plataforma
        </DialogTitle>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout className="max-h-[80dvh]" />
        </EmbeddedCheckoutProvider>
        <DialogFooter>
          <DialogClose asChild>
            Cancelar pagamento
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}