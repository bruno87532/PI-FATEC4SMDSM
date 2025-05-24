"use client"

import { Loader2 } from "lucide-react"
import { DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormLabel, FormMessage, FormItem, FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { maskPhone } from "@/utils/mask-phone"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userService } from "@/services/user"
import React from "react"
import { useState } from "react"

const FormSchema = z.object({
  phone: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.replace(/\D/g, "");
      }
      return val
    },
      z.string()
        .min(10, { message: "O número de telefone deve ter pelo menos 10 caracteres" })
        .regex(/^\d{2}9\d{7,8}/, { message: "O número de telefone deve ser válido" }),
    )
})

type FormSchema = z.infer<typeof FormSchema>

export const StepOne: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>,
  setPhone: React.Dispatch<React.SetStateAction<string>>
}> = ({
  setStep,
  setPhone
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<FormSchema>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        phone: ""
      }
    })

    const handleSubmit = async (data: FormSchema) => {
      setIsLoading(true)
      await userService.confirmationNumber(data.phone)
      setPhone(data.phone)
      setStep(1)
      setIsLoading(false)
    }

    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Telefone</DialogTitle>
          <DialogDescription>Atualize seu número de telefone. Este número será usado para contato.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                        const maskedValue = maskPhone(value)
                        field.onChange(maskedValue)
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    )
  }