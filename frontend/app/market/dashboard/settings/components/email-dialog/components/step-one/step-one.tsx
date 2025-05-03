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
import { ApiError } from "@/type/error"

const StepOneSchema = z.object({
  email: z.string().email("Informe um email válido"),
  name: z.string().min(1, "Informe um nome válido")
})

type StepOne = z.infer<typeof StepOneSchema>

export const StepOne = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const stepOneForm = useForm<StepOne>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      email: "",
      name: "",
    }
  })

  const handleSubmit = async (data: StepOne) => {
    setIsLoading(true)
    try {
      const user = await userService.createUser(data)
    } catch (error) {
      if (error instanceof ApiError && error.message === "Email already registered") {
        stepOneForm.setError("email", {
          type: "manual",
          message: "Email já cadastrado."
        })
        setIsLoading(false)
        return;
      }
    }
  }

  return (
    <Form {...stepOneForm}>
      <form onSubmit={stepOneForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={stepOneForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full">
          {
            isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Continuar"
          }
        </Button>
        <div className="text-center text-sm">
          Já possui uma conta?{" "}
          <Button type="button" variant="link" className="p-0">
            Entrar
          </Button>
        </div>
      </form>
    </Form>
  )
}