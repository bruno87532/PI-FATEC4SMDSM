import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAuthRegisterContext } from "../auth-register-context"

const StepTwoSchema = z.object({
    otp: z.string().length(6, "O código deve ter 6 dígitos.")
})

type StepTwo = z.infer<typeof StepTwoSchema>

export const StepTwo = () => {
    const { setRegisterStep } = useAuthRegisterContext()

    const resetRegister = () => {
        stepTwoForm.reset({ otp: "" })
        setRegisterStep(1)
    }

    const stepTwoForm = useForm<StepTwo>({
        resolver: zodResolver(StepTwoSchema),
        defaultValues: {
            otp: ""
        }
    })
    
    const handleSubmit = (data: StepTwo) => {
        setRegisterStep(3)
    }
    
    return (
        <Form {...stepTwoForm}>
            <form onSubmit={stepTwoForm.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                        Enviamos um código de verificação para o seu email.
                    </p>
                </div>
                <FormField
                    control={stepTwoForm.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código de verificação</FormLabel>
                            <FormControl>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={resetRegister}>
                        Voltar
                    </Button>
                    <Button type="submit" className="flex-1">
                        Verificar
                    </Button>
                </div>
            </form>
        </Form>
    )
}