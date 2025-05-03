"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormLabel, FormMessage, FormControl, FormItem, FormField } from "@/components/ui/form"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { userService } from "@/services/user"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "../../../context/user-content"

export const AdvertiserNameDialog = () => {
  const { user, setUser } = useUser()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const formSchema = z.object({
    advertiserName: z.string().min(1, { message: "O nome de anunciante deve ter pelo menos 1 caracter" })
  })

  type formSchema = z.infer<typeof formSchema>

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserName: ""
    }
  })

  const onSubmit = async (data: formSchema) => {
    try {
      await userService.updateUser(data)
      setUser((prev) => {
        if (!prev) return prev 
        return {
          ...prev,
          advertiserName: data.advertiserName
        }
      })
      toast({
        title: "Nome alterado",
        description: "Nome de anunciante alterado com sucesso"
      })
    } catch (error) {
      toast({
        title: "Erro interno",
        description: "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação, por favor tente novamente mais tarde"
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
          <DialogTitle>Editar Nome de Anunciante</DialogTitle>
          <DialogDescription>
            Atualize seu nome de anunciante. Este nome será exibido em seus anúncios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="advertiserName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Anunciante</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome de anunciante" {...field} />
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