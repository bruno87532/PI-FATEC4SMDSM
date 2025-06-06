"use client"

import { useEffect, useState } from "react"
import { planService } from "@/services/plan"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { DialogPrice } from "./components/dialog-price/dialog-price"
import { Button } from "@/components/ui/button"
import { Layout, BarChart2, Search, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const Stripe = () => {
  const monthly = ["Plano básico mensal", "Plano médio mensal", "Plano avançado mensal"]
  const yearly = ["Plano básico anual", "Plano médio anual", "Plano avançado anual"]
  const [plans, setPlans] = useState<Record<string, string>[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const plans = await planService.getPlan()
        setPlans(plans)
      } catch (err) {
        console.error("Erro ao carregar planos:", err)
        setError("Erro ao carregar os planos. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Carregando planos...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            {error}
            <Button onClick={() => window.location.reload()} className="mt-4 w-full" variant="outline">
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Nenhum plano encontrado. Entre em contato com o suporte.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden py-10 min-h-screen flex flex-col justify-center">
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
                    <p className="text-xs text-gray-400 mt-1">TAXAS E IMPOSTOS JÁ INCLUSOS</p>
                  </div>

                  <div className="space-y-4 py-4">
                    <div className="space-y-3">
                      {index === 0 && (
                        <>
                          <div className="flex items-start gap-2">
                            <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Aparece na aba de produtos</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Cadastro de produtos ilimitados</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Destaque nível três nas pesquisas</span>
                          </div>
                        </>
                      )}

                      {index === 1 && (
                        <>
                          <div className="flex items-start gap-2">
                            <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Aparece na aba principal e de produtos</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Cadastro de produtos ilimitados</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Destaque nível dois nas pesquisas de produtos</span>
                          </div>
                        </>
                      )}

                      {index === 2 && (
                        <>
                          <div className="flex items-start gap-2">
                            <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Aparece na aba principal e de produtos</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Cadastro de produtos ilimitados</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Destaque nível um nas pesquisas</span>
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
                    <p className="text-xs text-gray-400 mt-1">TAXAS E IMPOSTOS JÁ INCLUSOS</p>
                  </div>

                  <div className="space-y-4 py-4">
                    <div className="space-y-3">
                      {index === 0 && (
                        <>
                          <div className="flex items-start gap-2">
                            <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Aparece na aba de produtos</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Cadastro de produtos ilimitados</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Destaque nível três nas pesquisas</span>
                          </div>
                        </>
                      )}

                      {index === 1 && (
                        <>
                          <div className="flex items-start gap-2">
                            <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Aparece na aba principal e de produtos</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Cadastro de produtos ilimitados</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Destaque nível dois nas pesquisas</span>
                          </div>
                        </>
                      )}

                      {index === 2 && (
                        <>
                          <div className="flex items-start gap-2">
                            <Layout className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Aparece na aba principal e de produtos</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <BarChart2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Cadastro de produtos ilimitados</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Search className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">Destaque nível um nas pesquisas</span>
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
        </Tabs>

        <p className="text-center text-sm text-gray-500 mt-12 max-w-3xl mx-auto">
          A assinatura será renovada automaticamente pelo valor indicado no plano selecionado, salvo cancelamento.
          Cancele a qualquer momento. Restrições e outras condições se aplicam. Preço, conteúdo e funcionalidades estão
          sujeitos a alterações.
        </p>
      </div>
    </div>
  )
}

export default Stripe
