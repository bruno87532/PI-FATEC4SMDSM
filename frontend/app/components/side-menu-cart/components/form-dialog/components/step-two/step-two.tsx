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

const stepTwoSchema = z.object({
  otp: z
    .string()
    .min(6, {
      message: "O código deve ter no mínimo 6 caracteres.",
    })
    .max(6, {
      message: "O código deve ter no máximo 6 caracteres.",
    }),
})

type StepTwoSchema = z.infer<typeof stepTwoSchema>

export const StepTwo: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>
  phone: string
  setIsUserComplete: React.Dispatch<React.SetStateAction<boolean>>
  onComplete?: () => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setStep, phone, setIsUserComplete, onComplete, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser } = useUser()

  const stepTwoForm = useForm<StepTwoSchema>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      otp: "",
    },
  })

  const handleSubmit = async (data: StepTwoSchema) => {
    try {
      setIsLoading(true)
      await userService.verifyNumber(phone, data.otp)
      setIsUserComplete(true)
      setUser(
        (prev) => {
          if (!prev) return null
          return {
            ...prev,
            phone
          }
        }
      )
      setIsOpen(false)
      setIsOpen(true)
      onComplete?.()
    } catch (error) {
      if (error instanceof ApiError && error.message === "Invalid code") {
        stepTwoForm.setError("otp", {
          type: "manual",
          message: "Código inválido",
        })
      } else if (error instanceof ApiError && error.message === "Expired code") {
        stepTwoForm.setError("otp", {
          type: "manual",
          message: "Código expirado. Foi encaminhado um novo código para o seu whatsapp",
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
                  <FormMessage className="text-center" />
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
                {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Verificar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </div>
  )
}