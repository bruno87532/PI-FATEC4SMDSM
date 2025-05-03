"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormLabel, FormMessage, FormControl, FormItem, FormField, FormDescription } from "@/components/ui/form"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export const PasswordDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  
  const formSchema = z
    .object({
      currentPassword: z.string().min(1, {
        message: "A senha atual é obrigatória.",
      }),
      newPassword: z
        .string()
        .min(8, {
          message: "A senha deve ter pelo menos 8 caracteres.",
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
          message: "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número.",
        }),
      confirmPassword: z.string().min(1, {
        message: "Confirme sua nova senha.",
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "As senhas não coincidem.",
      path: ["confirmPassword"],
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit() {
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen)
        if (!isOpen) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Alterar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>Insira sua senha atual e a nova senha para atualizar.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Atual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Atualizar Senha</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}