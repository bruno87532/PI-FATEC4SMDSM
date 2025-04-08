import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const SubscriptionCanceled = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Nós lamentamos muito ver você sair</CardTitle>
          <CardDescription>Sua assinatura foi cancelada com sucesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-full bg-gray-100   p-3 inline-block mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M17 7 7 17M7 7l10 10" />
            </svg>
          </div>
          <p className="text-gray-800">
            Agradecemos o tempo que você passou conosco. Sua conta permanecerá ativa até o final do seu atual
            período de cobrança.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Você se importaria de compartilhar o motivo de sua saída?</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-sm">
                Muito caro
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                Não estou usando
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                Falta de recursos
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                Encontrei outra alternativa
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full">Reativar minha inscrição</Button>
          <div className="flex justify-between w-full">
            <Link href="#" className="w-full">
              <Button
                variant="outline"
                className="border-gray-900 text-gray-800 hover:bg-gray-900 hover:text-gray-300 w-full"
              >
                Voltar para a página inicial
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SubscriptionCanceled