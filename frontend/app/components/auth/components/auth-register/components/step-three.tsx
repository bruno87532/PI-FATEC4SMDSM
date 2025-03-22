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
import { useAuthRegisterContext } from "../auth-register-context"
import { useAuthContext } from "../../../auth-context"

const StepThreeSchema = z.object({
  password: z.string(),
  confirmPassword: z.string()
})

type StepThree = z.infer<typeof StepThreeSchema>

export const StepThree = () => {
  const { setRegisterStep } = useAuthRegisterContext()
  const { setActiveTab } = useAuthContext()

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  
  const stepThreeForm = useForm<StepThree>({
    resolver: zodResolver(StepThreeSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const handleSubmit = (data: StepThree) => {

  }

  return (
    <Form {...stepThreeForm}>
      <form
        onSubmit={stepThreeForm.handleSubmit((data) => {
          setRegisterStep(1)
          setActiveTab("login")
        })}
        className="space-y-4"
      >
        <FormField
          control={stepThreeForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
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
              <FormLabel>Confirmar Senha</FormLabel>
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
          <Button type="button" variant="outline" className="flex-1" onClick={() => setRegisterStep(2)}>
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Cadastrar
          </Button>
        </div>
      </form>
    </Form>
  )
}