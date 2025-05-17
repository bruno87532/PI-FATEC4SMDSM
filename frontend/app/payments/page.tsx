"use client"

import { useEffect, useState } from "react"
import { planService } from "@/services/plan"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { DialogPrice } from "./components/dialog-price/dialog-price"
import { Button } from "@/components/ui/button"
import { StripeService } from "@/services/stripe"
import { useRouter } from "next/navigation"
import { Layout, BarChart2, Search, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { UserProvider } from "../context/user-context"

const Stripe = () => {
  const router = useRouter()

  const { toast } = useToast()
  const monthly = ["Plano básico mensal", "Plano médio mensal", "Plano avançado mensal"]
  const yearly = ["Plano básico anual", "Plano médio anual", "Plano avançado anual"]
  const [plans, setPlans] = useState<Record<string, string>[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await planService.getPlan()
        setPlans(plans)
        setIsLoading(true)
      } catch (error) {
        toast({
          title: "Erro interno.",
          description: "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor, tente novamente mais tarde."
        })
      }
    }

    fetchPlans()
  }, [])

  const cancelSubscription = async () => {
    setShowCancelDialog(true)
  }

  const confirmCancelSubscription = async () => {
    try {
      await StripeService.cancelSubscription()
      router.push("/subscription-canceled")
    } catch (error) { }
  }

  if (!isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    )
  }

  return (
    <UserProvider>
      <div className="relative overflow-hidden py-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-green-100 to-green-300 opacity-50 blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-green-100 to-green-300 opacity-50 blur-xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-700">
            Escolha Seu Plano de Divulgação
          </h1>

          <Tabs defaultValue="monthly" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-green-100 p-1 rounded-full">
              <TabsTrigger
                value="monthly"
                className="rounded-full py-3 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Mensal
              </TabsTrigger>
              <TabsTrigger
                value="annual"
                className="rounded-full py-3 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Anual
              </TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="grid md:grid-cols-3 gap-8">
              {monthly.map((planMonthly, index) => {
                const plan = plans?.find((p) => p.name === planMonthly)
                if (!plan) return null

                const isPopular = index === 1

                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg border-2 ${isPopular ? "border-green-500" : "border-transparent"} bg-white shadow-xl p-6`}
                  >
                    <div className="text-center pb-4">
                      {isPopular && (
                        <div className="inline-block mb-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          O MAIS POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-green-800">
                        {index === 0 ? "Simples" : index === 1 ? "Premium" : "Ultra"}
                      </h3>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-green-700">R$ {(74.99 + index * 5).toFixed(2)}</span>
                        <span className="text-sm text-gray-500">/mês</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">+ TAXAS E IMPOSTOS</p>
                    </div>

                    <div className="space-y-4 py-4">
                      <div className="space-y-3">
                        {index === 0 && (
                          <>
                            <div className="flex items-start gap-2">
                              <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                Posição de destaque na segunda coluna 1 hora por dia
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">1 propaganda no banner principal por semana</span>
                            </div>
                          </>
                        )}

                        {index === 1 && (
                          <>
                            <div className="flex items-start gap-2">
                              <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">Destaque na segunda coluna 2 horas por dia</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">3 propagandas por semana no banner principal</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">Destaque nível 2 nas pesquisas de produtos</span>
                            </div>
                          </>
                        )}

                        {index === 2 && (
                          <>
                            <div className="flex items-start gap-2">
                              <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                Destaque na primeira coluna por 3 horas por dia
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                5 dias de propagandas por semana no banner principal
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">Destaque nível 3 nas pesquisas</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 pt-4">
                      <div
                        className={`w-full ${isPopular ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white font-medium rounded-full overflow-hidden`}
                      >
                        <DialogPrice price={plan.idPrice} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </TabsContent>
            <TabsContent value="annual" className="grid md:grid-cols-3 gap-8">
              {yearly.map((planYearly, index) => {
                const plan = plans?.find((p) => p.name === planYearly)
                if (!plan) return null

                const isPopular = index === 1
                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg border-2 ${isPopular ? "border-green-500" : "border-transparent"} bg-white shadow-xl p-6`}
                  >
                    <div className="text-center pb-4">
                      {isPopular && (
                        <div className="inline-block mb-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          O MAIS POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-green-800">
                        {index === 0 ? "Simples" : index === 1 ? "Premium" : "Ultra"}
                      </h3>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-green-700">R$ {(749.99 + index * 50).toFixed(2)}</span>
                        <span className="text-sm text-gray-500">/ano</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">+ TAXAS E IMPOSTOS</p>
                    </div>

                    <div className="space-y-4 py-4">
                      <div className="space-y-3">
                        {index === 0 && (
                          <>
                            <div className="flex items-start gap-2">
                              <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                Posição de destaque na segunda coluna 1 hora por dia
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">1 propaganda no banner principal por semana</span>
                            </div>
                          </>
                        )}

                        {index === 1 && (
                          <>
                            <div className="flex items-start gap-2">
                              <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">Destaque na segunda coluna 2 horas por dia</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">3 propagandas por semana no banner principal</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">Destaque nível 2 nas pesquisas de produtos</span>
                            </div>
                          </>
                        )}

                        {index === 2 && (
                          <>
                            <div className="flex items-start gap-2">
                              <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                Destaque na primeira coluna por 3 horas por dia
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                5 dias de propagandas por semana no banner principal
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">Destaque nível 3 nas pesquisas</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 pt-4">
                      <div
                        className={`w-full ${isPopular ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white font-medium rounded-full overflow-hidden`}
                      >
                        <DialogPrice price={plan.idPrice} />
                      </div>
                      <button className="text-gray-500 hover:text-green-700 text-xs w-full">PULAR TESTE GRATUITO</button>
                    </div>
                  </div>
                )
              })}
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Button
              onClick={cancelSubscription}
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
              variant="outline"
            >
              Cancelar assinatura
            </Button>

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl text-green-700">Cancelar assinatura</DialogTitle>
                  <DialogDescription className="text-center pt-2">
                    Você tem certeza que deseja cancelar sua assinatura?
                    <p className="mt-2 font-medium">Sua assinatura ficará ativa até o fim do período contratado.</p>
                    <p className="mt-2 font-medium">Não haverá mais cobranças recorrentes.</p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row justify-center gap-2 sm:justify-center">
                  <DialogClose asChild>
                    <Button variant="outline" className="border-green-600 text-green-600">
                      Voltar
                    </Button>
                  </DialogClose>
                  <Button onClick={confirmCancelSubscription} className="bg-red-500 hover:bg-red-600 text-white">
                    Confirmar cancelamento
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-center text-sm text-gray-500 mt-12 max-w-3xl mx-auto">
            A assinatura será renovada automaticamente pelo valor indicado no plano selecionado, salvo cancelamento.
            Cancele a qualquer momento. Restrições e outras condições se aplicam. Preço, conteúdo e funcionalidades estão
            sujeitos a alterações.
          </p>
        </div>
      </div>
    </UserProvider>
  )
}

export default Stripe
