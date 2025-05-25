import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { authService } from "@/services/auth"
import { ApiError } from "@/type/error"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { useStep } from "../context/step-context"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/app/context/user-context"

const StepTwoSchema = z.object({
  otp: z.string().length(6, "O código deve ter 6 dígitos.")
})

type StepTwo = z.infer<typeof StepTwoSchema>

export const StepTwo: React.FC<{ setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, email: string }> = ({ setIsOpen, email }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user, setUser } = useUser()
  const { step, setStep } = useStep()
  const { toast } = useToast()

  const resetRegister = () => {
    stepTwoForm.reset({ otp: "" })
    setStep(1)
  }

  const stepTwoForm = useForm<StepTwo>({
    resolver: zodResolver(StepTwoSchema),
    defaultValues: {
      otp: ""
    }
  })

  const handleSubmit = async (data: StepTwo) => {
    try {
      setIsLoading(true)
      await authService.verifyRecoverEmail(data.otp)
      toast({
        title: "Email alterado",
        description: "Seu email foi alterado com sucesso"
      })
      let emailCensored = ""
      const [name, domain] = email.split("@")
      if (name.length <= 4) {
        emailCensored = `${name.replace(/./g, "*")}@${domain}`
      } {
        const start = name.slice(0, 2);
        const middle = name.slice(2, -2).replace(/./g, "*")
        const end = name.slice(-2)
  
        emailCensored = `${start}${middle}${end}@${domain}`
      }
      setUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          email: emailCensored
        }
      })
      setStep(1)
      setIsOpen(false)
    } catch (error) {
      if (error instanceof ApiError && (error.message === "Invalid code" || error.message === "Recover email not found")) {
        stepTwoForm.setError("otp", {
          type: "manual",
          message: "Código de verificação inválido."
        })
      }
      if (error instanceof ApiError && error.message === "Expired code") {
        stepTwoForm.setError("otp", {
          type: "manual",
          message: "Código de verificação expirado. Foi encaminhado um novo código para o seu email."
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...stepTwoForm}>
      <form onSubmit={stepTwoForm.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Enviamos um código de verificação para o seu email.
          </p>
        </div>
        <FormField
          control={stepTwoForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={resetRegister}>
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            {
              isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Continuar"
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}