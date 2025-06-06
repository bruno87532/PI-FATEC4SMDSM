"use client"

import { Form, FormField, FormControl, FormLabel, FormMessage, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { userService } from "@/services/user"
import { ApiError } from "@/type/error"
import { Loader2 } from "lucide-react"
import { useUser } from "@/app/context/user-context"

const StepTwoSchema = z.object({
  otp: z.string().length(6, "O código deve ter 6 dígitos")
})

type StepTwoSchema = z.infer<typeof StepTwoSchema>

export const StepTwo: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  phone: string;
  setIsUserAdvertiser: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setStep, phone, setIsUserAdvertiser }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setUser } = useUser()

  const stepTwoForm = useForm<StepTwoSchema>({
    resolver: zodResolver(StepTwoSchema),
    defaultValues: {
      otp: ""
    }
  })

  const handleSubmit = async (data: StepTwoSchema) => {
    try {
      setIsLoading(true)
      await userService.verifyNumber(phone, data.otp)
      setIsUserAdvertiser(true)
      setUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          phone
        }
      })
    } catch (error) {
      if (error instanceof ApiError && error.message === "Invalid code") {
        stepTwoForm.setError("otp", {
          type: "manual",
          message: "Código inválido"
        })
      } else if (error instanceof ApiError && error.message === "Expired code") {
        stepTwoForm.setError("otp", {
          type: "manual",
          message: "Código expirado. Foi encaminhado um novo código para o seu whatsapp"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
      <DialogTitle className="text-xl font-bold text-green-700 mb-2">Verificação do WhatsApp</DialogTitle>
      <DialogDescription className="mb-4 text-gray-600">
        Enviamos um código de 6 dígitos para o seu WhatsApp. Por favor, insira o código abaixo para confirmar seu
        número.
      </DialogDescription>

      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <Form {...stepTwoForm}>
          <form onSubmit={stepTwoForm.handleSubmit(handleSubmit)}>
            <FormField
              control={stepTwoForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-center">
                  <FormLabel>Código de verificação</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center"/>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4 pt-3 border-t border-green-100">
              <Button
                type="button"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors rounded-full"
                onClick={() => setStep(0)}
              >
                Voltar
              </Button>
              <Button
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full"
              >
                { isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Verificar" }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </div>
  )
}