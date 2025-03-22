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

const StepThreeSchema = z.object({
  password: z.string(),
  confirmPassword: z.string()
})

type StepThree = z.infer<typeof StepThreeSchema>

export const StepThree = () => {
  const { setActiveTab } = useAuthContext()
  const { setRecoverStep } = useAuthRecoverContext()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

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

  const handleSubmit = (data: StepThree) => {
    setActiveTab("login")
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
            Alterar Senha
          </Button>
        </div>
      </form>
    </Form>
  )
}