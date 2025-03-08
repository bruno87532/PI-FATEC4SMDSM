"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "./auth-context"

const formSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "A senha é obrigatória"),
})

type FormValues = z.infer<typeof formSchema>

interface LoginFormProps {
    onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const { setActiveTab } = useAuthContext()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: FormValues) {
        // Aqui você faria o login
        console.log("Login com:", data)
        onSuccess()
    }

    return (
        <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Entrar na sua conta</h3>
                <p className="text-sm text-muted-foreground">Digite suas credenciais para acessar sua conta</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
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
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                <div className="text-sm text-right">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("recover")}
                                        className="text-primary hover:underline"
                                    >
                                        Esqueceu a senha? Recuperar
                                    </button>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Entrar
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <button type="button" onClick={() => setActiveTab("signup")} className="text-primary hover:underline">
                    Criar uma conta
                </button>
            </div>
        </div>
    )
}

