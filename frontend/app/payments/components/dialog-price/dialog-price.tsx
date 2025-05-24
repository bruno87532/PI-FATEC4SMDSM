"use client"

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { loadStripe } from "@stripe/stripe-js"
import { useCallback, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StripeService } from "@/services/stripe"
import { subscriptionService } from "@/services/subscription"
import { useToast } from "@/hooks/use-toast"
import { FormDialog } from "./components/form-dialog/form-dialog"
import { CancelImmediately } from "./components/cancel-immediately/cancel-immediately"
import { Loader2 } from "lucide-react"
import { useUser } from "@/app/context/user-context"

export const DialogPrice = ({ price }: { price: string }) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "")
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const { user, setUser } = useUser()
  const [showForm, setShowForm] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isUserAdvertiser, setIsUserAdvertiser] = useState<boolean>(true)
  const [isSubscriptionActivate, setIsSubscriptionActivate] = useState<boolean>(false)
  const { toast } = useToast()

  const fetchClientSecret = useCallback(() => StripeService.createCheckout(price), [price])
  const options = { fetchClientSecret }
  useEffect(() => {
    console.log(options)
  }, [options])

  useEffect(() => {
    const getSubscriptionActiveByIdUser = async () => {
      try {
        await subscriptionService.getSubscriptionActiveByIdUser()
        setIsSubscriptionActivate(true)
      } catch (error) {
        setIsSubscriptionActivate(false)
      }
    }

    const isAdvertiser = async () => {
      try {
        if (
          user &&
          (!user.zipCode ||
            !user.state ||
            !user.city ||
            !user.neighborhood ||
            !user.road ||
            !user.marketNumber ||
            !user.advertiserName ||
            !user.phone)
        ) {
          setIsUserAdvertiser(false)
        } else {
          setIsUserAdvertiser(true)
        }
        setUser(user)
      } catch (error) {
        toast({
          title: "Erro interno.",
          description:
            "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor, tente novamente mais tarde.",
        })
      }
    }

    getSubscriptionActiveByIdUser()
    isAdvertiser()
  }, [user])


  const handleOpenChange = () => {
    setIsOpen(!isOpen)
    if (isOpen === false) {
      setShowCheckout(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Comprar</Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border-green-100 shadow-xl overflow-hidden">
        <div className="relative z-10">
          {!isUserAdvertiser ? (
            <FormDialog setIsUserAdvertiser={setIsUserAdvertiser} />
          ) : !showCheckout && isSubscriptionActivate ? (
            <>
              <CancelImmediately setIsOpen={setIsOpen} setIsSubscriptionActivate={setIsSubscriptionActivate} />
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
