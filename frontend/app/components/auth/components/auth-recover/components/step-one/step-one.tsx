import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import React from "react"
import { useAuthRecoverContext } from "../../auth-recover-context"
import { useAuthContext } from "@/app/components/auth/auth-context"

const StepOneSchema = z.object({
  email: z.string().email("Email inválido")
})

type StepOne = z.infer<typeof StepOneSchema>

export const StepOne = () => {
  const { setRecoverStep } = useAuthRecoverContext()
  const { setActiveTab } = useAuthContext()

  const stepOneForm = useForm<StepOne>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      email: ""
    }
  })

  const handleSubmit = (data: StepOne) => {
    setRecoverStep(2)
    console.log("teste")
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
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  )
}