"use client"

import { useEffect } from "react";
import { planService } from "@/services/plan";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { DialogPrice } from "./components/dialog-price/dialog-price";
import { useState } from "react";

export const Stripe = () => {
  const monthly = ["Plano básico mensal", "Plano médio mensal", "Plano avançado mensal"]
  const yearly = ["Plano básico anual", "Plano médio anual", "Plano avançado anual"]
  const [plans, setPlans] = useState<Record<string, string>[] | undefined>(undefined)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await planService.getPlan()
        setPlans(plans)
      } catch (error) {
        throw error
      }
    }

    fetchPlans()
  }, [])

  return (
    <Tabs defaultValue="monthly" className="max-w-5xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="monthly">Mensal</TabsTrigger>
        <TabsTrigger value="annual">Anual</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly" className="grid md:grid-cols-3 gap-8">
        {monthly.map((planMonthly, index) => {
          const plan = plans?.find((p) => p.name === planMonthly);
          if (!plan) return null
          return (
            <DialogPrice key={index} price={plan.idPrice} />
          )
        })}
      </TabsContent>
      <TabsContent value="annual" className="grid md:grid-cols-3 gap-8">
        {yearly.map((planYearly, index) => {
          const plan = plans?.find((p) => p.name === planYearly);
          if (!plan) return null
          return (
            <DialogPrice key={index} price={plan.idPrice} />
          )
        })}
      </TabsContent>
    </Tabs>
  )
}