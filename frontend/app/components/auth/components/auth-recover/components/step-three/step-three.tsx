"use client"

import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useAuthRecoverContext } from "../../auth-recover-context"
import { useAuthContext } from "@/app/components/auth/auth-context"
import { ApiError } from "@/type/error"
import { authService } from "@/services/auth"
import { Loader2 } from "lucide-react"

const StepThreeSchema = z.object({
  password: z.string()
  .min(8, "A senha deve conter pelo menos 8 caracteres")
  .regex(/(?=.*[A-Z])/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/(?=.*[a-z])/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/(?=.*\W)/, "A senha deve conter pelo menos um caracter especial")
  .regex(/(?=(.*\d){5,})/, "A senha deve conter pelo menos cinco números"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas devem ser iguais",
  path: ["confirmPassword"]
})

type StepThree = z.infer<typeof StepThreeSchema>

export const StepThree = () => {
  const { setActiveTab } = useAuthContext()
  const { setRecoverStep, idUser, randomCode } = useAuthRecoverContext()

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const resetPassword = () => {
    stepThreeForm.reset({
      password: "",
      confirmPassword: ""
    })
    setRecoverStep(2)
  }

  const stepThreeForm = useForm<StepThree>({
    resolver: zodResolver(StepThreeSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const handleSubmit = async (data: StepThree) => {
    try {
      setIsLoading(true)
      await authService.changePassword({
        password: data.password,
        idUser,
      })
      setRecoverStep(1)
      setActiveTab("login")
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Form {...stepThreeForm}>
      <form onSubmit={stepThreeForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={stepThreeForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="******" {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stepThreeForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} placeholder="******" {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => resetPassword()}>
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            {
              isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : "Alterar senha"
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}