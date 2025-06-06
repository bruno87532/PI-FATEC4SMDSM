import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import React from "react"
import { userService } from "@/services/user"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { authService } from "@/services/auth"
import { ApiError } from "@/type/error"
import { useStep } from "../context/step-context"

const StepOneSchema = z.object({
  oldEmail: z.string().email("Informe um email válido"),
  newEmail: z.string().email("Informe um email válido"),
})

type StepOne = z.infer<typeof StepOneSchema>

export const StepOne: React.FC<{ setEmail: React.Dispatch<React.SetStateAction<string>> }> = ({ setEmail }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setStep } = useStep()

  const stepOneForm = useForm<StepOne>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      oldEmail: "",
      newEmail: "",
    }
  })

  const handleSubmit = async (data: StepOne) => {
    setIsLoading(true)
    try {
      const res = await userService.emailIsEqual(data.oldEmail)
      if (res.success) {
        if (data.newEmail === data.oldEmail) {
          stepOneForm.setError("newEmail", {
            type: "manual",
            message: "O novo email deve ser diferente do antigo"
          })
        } else {
          await authService.authRecoverEmail(data.newEmail)
          setEmail(data.newEmail)
          setStep(2)
        }
      } else {
        stepOneForm.setError("oldEmail", {
          type: "manual",
          message: "Email diferente do cadastrado"
        })
      }
    } catch (error) {
      if (error instanceof ApiError && error.message === "Email already registered") {
        stepOneForm.setError("newEmail", {
          type: "manual",
          message: "Email já cadastrado"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...stepOneForm}>
      <form onSubmit={stepOneForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={stepOneForm.control}
          name="oldEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Antigo email</FormLabel>
              <FormControl>
                <Input placeholder="seu@antigoemail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stepOneForm.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Novo email</FormLabel>
              <FormControl>
                <Input placeholder="seu@novoemail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {
            isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Continuar"
          }
        </Button>
      </form>
    </Form>
  )
}