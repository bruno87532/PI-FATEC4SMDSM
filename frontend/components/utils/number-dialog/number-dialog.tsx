"use client"

import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormLabel, FormMessage, FormItem, FormControl, FormField } from "@/components/ui/form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userService } from "@/services/user"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/app/context/user-context"

const FormSchema = z.object({
  marketNumber: z.string().min(1, { message: "O número é obrigatório" })
})

type FormSchema = z.infer<typeof FormSchema>

export const NumberDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { toast } = useToast()
  const { setUser } = useUser()

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marketNumber: ""
    }
  })

  const handleSubmit = async (data: FormSchema) => {
    await userService.updateUser({ marketNumber: data.marketNumber })
    setIsOpen(false)
    toast({
      title: "Número alterado",
      description: "Número alterado com sucesso"
    })
    setUser((prev) => {
      if (!prev) return null

      return {
        ...prev,
        marketNumber: data.marketNumber
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar número</DialogTitle>
          <DialogDescription>Atualize seu número</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="marketNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu número" {...field} />
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