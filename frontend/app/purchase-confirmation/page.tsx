import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const PurchaseConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 border-green-500 border-2">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-green-500/20 p-3">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Obrigado pela sua assinatura!</h1>

          <p className="text-gray-800">
            Estamos muito felizes em tê-lo como assinante. Agora você tem acesso a todos os recursos de anunciante da nossa plataforma
          </p>

          <div className="grid gap-4 w-full mt-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">Ir para o painel administrativo</Button>

            <Link href="#" className="w-full">
              <Button
                variant="outline"
                className="border-gray-900 text-gray-800 hover:bg-gray-900 hover:text-gray-300 w-full"
              >
                Voltar para a página inicial
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-800 mt-6 w-full">
            <p className="text-gray-800 text-sm">Se você tiver alguma dúvida, entre em contato com nosso suporte pelo email pifatecdsm4sm@gmail.com.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PurchaseConfirmation