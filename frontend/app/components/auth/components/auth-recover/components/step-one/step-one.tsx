import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import React from "react"
import { useAuthRecoverContext } from "../../auth-recover-context"
import { useAuthContext } from "@/app/components/auth/auth-context"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { authService } from "@/services/auth"
import { ApiError } from "@/type/error"

const StepOneSchema = z.object({
  email: z.string().email("Informe um email válido")
})

type StepOne = z.infer<typeof StepOneSchema>

export const StepOne = () => {
  const { setRecoverStep, setIdUser } = useAuthRecoverContext()
  const { setActiveTab } = useAuthContext()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const stepOneForm = useForm<StepOne>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      email: ""
    }
  })

  const handleSubmit = async (data: StepOne) => {
    try {
      setIsLoading(true)
      const res = await authService.authRecover(data.email)
      setIdUser(res.idUser)
      setRecoverStep(2)
    } catch (error) {
      if (error instanceof ApiError && error.message === "User not found") {
        stepOneForm.setError("email", {
          type: "manual",
          message: "Usuário não cadastrado."
        })
      }
      if (error instanceof ApiError && error.message === "User is not verified") {
        stepOneForm.setError("email", {
          type: "manual",
          message: "Usuário não verificado."
        })
      }
      setIsLoading(false)
    }
  }

  return (
    <Form {...stepOneForm}>
      <form onSubmit={stepOneForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={stepOneForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("login")}>
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            {
              isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Enviar"
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}