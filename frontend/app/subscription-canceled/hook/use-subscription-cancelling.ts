"use client"

import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/type/error"
import React from "react"
import { subscriptionCancellingService } from "@/services/subscription-cancelling"
import { StripeService } from "@/services/stripe"
import { useRouter } from "next/navigation"

export const useSubscriptionCancelling = ({ setIsLoadingReason, setIsLoadingReactivated }:
  {
    setIsLoadingReason: React.Dispatch<React.SetStateAction<string | null>>
    setIsLoadingReactivated: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
  const router = useRouter()
  const { toast } = useToast()
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setIsLoadingReason(e.currentTarget.value)
      await subscriptionCancellingService.createSubscriptionCancelling(e.currentTarget.value)
      toast({
        title: "Opinião enviada",
        description: "Muito obrigado pela sua opinião, ela é muito importante para nós!"
      })
    } catch (error) {
      if (error instanceof ApiError && error.message === "Daily creation limit exceeded") {
        toast({
          title: "Limite de requisição excedido",
          description: "É possível enviar apenas um feedback de cancelamento de assinatura por dia"
        })
      }
    } finally {
      setIsLoadingReason(null)
    }
  }

  const reactivateSubscription = () => {
    try {
      setIsLoadingReactivated(true)
      StripeService.reactivateSubscription()
      router.push("/subscription-reactivated")
    } catch {
      setIsLoadingReactivated(false)
    }
  }

  return { handleClick, reactivateSubscription }
}