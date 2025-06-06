import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import React from "react"

export const CancelImmediately: React.FC<{ 
  setIsSubscriptionActivate: React.Dispatch<React.SetStateAction<boolean>>; 
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsSubscriptionActivate, setIsOpen }) => {
  return (
    <>
      <DialogTitle className="text-xl font-bold text-green-700 flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5" />
        Atenção
      </DialogTitle>

      <div className="">
        <div className="flex flex-col justify-center gap-2 sm:justify-center">
          <DialogDescription>
            Se continuar com a compra sua assinatura será cancelada imediatamente.
            <p className="mt-2 font-medium">Você perderá todos os benefícios da assinatura atual.</p>
          </DialogDescription>
          <div className="flex flex-row justify-center gap-4 mt-2">
            <Button variant="outline" className="border-green-600 text-green-600" onClick={() => {
              setIsOpen(false)
            }
            }>
              Voltar
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => setIsSubscriptionActivate(false)}>
              Confirmar cancelamento
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}