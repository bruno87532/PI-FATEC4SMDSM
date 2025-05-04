"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormLabel, FormMessage, FormControl, FormItem, FormField, FormDescription } from "@/components/ui/form"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { userService } from "@/services/user"
import { useUser } from "../../../context/user-content"
import { useToast } from "@/hooks/use-toast"
import { maskPhone } from "@/utils/mask-phone"

export const PhoneDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { user, setUser } = useUser()
  const { toast } = useToast()

  const formSchema = z.object({
    phone: z.string()
      .min(11, { message: "O número de telefone deve ter pelo menos 11 caracteres" })
      .regex(/^\(\d{2}\) 9\d{4} - \d{4}$/, { message: "O número de telefone deve ser válido" })
  })

  type formSchema = z.infer<typeof formSchema>

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: ""
    }
  })

  const onSubmit = async (data: formSchema) => {
    try {
      const newData = {
        phone: data.phone.replace(/\D/g, "")
      }
      await userService.updateUser(newData)
      setUser((prev) => {
        if (!prev) return null

        return {
          ...prev,
          phone: newData.phone
        }
      })
      toast({
        title: "Telefone alterado",
        description: "Telefone alterado com sucesso"
      })
    } catch (error) {
      toast({
        title: "Erro interno",
        description: "Ocorreu um erro interno ao prosseguir com a sua solicitação. Por favor tente novamente mais tarde"
      })
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Telefone</DialogTitle>
          <DialogDescription>Atualize seu número de telefone. Este número será usado para contato.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field}
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
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}