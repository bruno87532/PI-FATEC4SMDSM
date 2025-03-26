"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";
import { StripeService } from "@/services/stripe";

export const Stripe = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ""
  )

  const fetchClientSecret = useCallback(() => StripeService.createCheckout(), [])
  const options = { fetchClientSecret }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Comprar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Anuncie na nossa plataforma
        </DialogTitle>
        <EmbeddedCheckoutProvider stripe={ stripePromise }  options={ options }>
          <EmbeddedCheckout className="max-h-[80dvh]"/>
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