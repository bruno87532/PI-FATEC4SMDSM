"use client"

import { Form, FormMessage, FormControl, FormItem, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useAuthContext } from "../../auth-context"

const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
})

type LoginSchema = z.infer<typeof LoginSchema>

export const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setActiveTab } = useAuthContext()

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleSubmit = (data: LoginSchema) => {

  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={loginForm.control}
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
        <FormField
          control={loginForm.control}
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
        <Button
          type="button"
          variant="link"
          className="px-0 text-sm"
          onClick={() => {
            setActiveTab("recover")
          }}
        >
          Esqueci minha senha
        </Button>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        <div className="text-center text-sm">
          Não possui uma conta?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0"
            onClick={() => {
              setActiveTab("register")
            }}
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </Form>
  )
}
