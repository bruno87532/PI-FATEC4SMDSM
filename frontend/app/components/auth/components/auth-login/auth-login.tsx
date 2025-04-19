"use client"

import { Form, FormMessage, FormControl, FormItem, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuthContext } from "../../auth-context"
import { authService } from "@/services/auth"
import { ApiError } from "@/type/error"
import { useAuth } from "@/app/context/auth-context"

const LoginSchema = z.object({
  email: z.string().email("Informe um email válido"),
  password: z.string().min(1, "A senha é obrigatória"),
})

type LoginSchema = z.infer<typeof LoginSchema>

export const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setActiveTab } = useAuthContext()
  const context = useAuth()

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleSubmit = async (data: LoginSchema) => {
    try {
      setIsLoading(true)
      await authService.login(data)
      context.setIsLoggedin(true)
      alert("Login feito com sucesso!! Este alert é temporário, só até criar uma tela.")
    } catch (error) {
      if (error instanceof ApiError && error.message === "Invalid email or password") {
        loginForm.setError("password", {
          type: "manual",
          message: "Email ou senha inválido."
        })
      }
      setIsLoading(false)
    }
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
          {
            isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Entrar"
          }
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
