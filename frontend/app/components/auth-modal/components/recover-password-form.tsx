"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const emailSchema = z.object({
    email: z.string().email("Email inválido"),
})

const otpSchema = z.object({
    otp: z.string().length(6, "O código deve ter 6 dígitos"),
})

const passwordSchema = z
    .object({
        password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    })

type EmailFormValues = z.infer<typeof emailSchema>
type OtpFormValues = z.infer<typeof otpSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

interface RecoverPasswordFormProps {
    onSuccess: () => void
    onCancel: () => void
}

export function RecoverPasswordForm({ onSuccess, onCancel }: RecoverPasswordFormProps) {
    const [step, setStep] = useState<"email" | "otp" | "password">("email")
    const [userEmail, setUserEmail] = useState("")

    // Email form
    const emailForm = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })

    // OTP form
    const otpForm = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    })

    // Password form
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    function onEmailSubmit(data: EmailFormValues) {
        // Aqui você enviaria o email com o código
        console.log("Enviando código para:", data.email)
        setUserEmail(data.email)
        setStep("otp")
    }

    function onOtpSubmit(data: OtpFormValues) {
        // Aqui você verificaria o código
        console.log("Verificando código:", data.otp)
        setStep("password")
    }

    function onPasswordSubmit(data: PasswordFormValues) {
        // Aqui você redefiniria a senha
        console.log("Redefinindo senha para:", data.password)
        onSuccess()
    }

    return (
        <div className="space-y-4 py-2 pb-4">
            {step === "email" && (
                <>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Recuperar senha</h3>
                        <p className="text-sm text-muted-foreground">Digite seu email para receber um código de recuperação</p>
                    </div>
                    <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                            <FormField
                                control={emailForm.control}
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
                            <div className="flex flex-col space-y-2">
                                <Button type="submit" className="w-full">
                                    Enviar código
                                </Button>
                                <Button type="button" variant="ghost" onClick={onCancel} className="w-full">
                                    Voltar para login
                                </Button>
                            </div>
                        </form>
                    </Form>
                </>
            )}

            {step === "otp" && (
                <>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Verificar email</h3>
                        <p className="text-sm text-muted-foreground">Digite o código de 6 dígitos enviado para {userEmail}</p>
                    </div>
                    <Form {...otpForm}>
                        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                            <FormField
                                control={otpForm.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputOTP maxLength={6}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col space-y-2">
                                <Button type="submit" className="w-full">
                                    Verificar código
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setStep("email")} className="w-full">
                                    Voltar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </>
            )}

            {step === "password" && (
                <>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Criar nova senha</h3>
                        <p className="text-sm text-muted-foreground">Crie uma nova senha para sua conta</p>
                    </div>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nova senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar nova senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col space-y-2">
                                <Button type="submit" className="w-full">
                                    Redefinir senha
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setStep("otp")} className="w-full">
                                    Voltar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </>
            )}
        </div>
    )
}

