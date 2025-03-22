import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import React from "react"
import { useAuthContext } from "../../../auth-context"
import { useAuthRegisterContext } from "../auth-register-context"

const StepOneSchema = z.object({
    email: z.string().email("Email inválido")
})

type StepOne = z.infer<typeof StepOneSchema>

export const StepOne = () => {
    const { setActiveTab } = useAuthContext()
    const { setRegisterStep } = useAuthRegisterContext()

    const stepOneForm = useForm<StepOne>({
        resolver: zodResolver(StepOneSchema),
        defaultValues: {
            email: ""
        }
    }) 

    const handleSubmit = (data: StepOne) => {
        setRegisterStep(2)
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
                <Button type="submit" className="w-full">
                    Continuar
                </Button>
                <div className="text-center text-sm">
                    Já possui uma conta?{" "}
                    <Button type="button" variant="link" className="p-0" onClick={() => setActiveTab("login")}>
                        Entrar
                    </Button>
                </div>
            </form>
        </Form>
    )
}