"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FormMessage, Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { viacep } from "@/services/viacep"
import { userService } from "@/services/user"
import { useUser } from "@/app/context/user-context"
import { useToast } from "@/hooks/use-toast"

const FormSchema = z.object({
  zipCode: z.string().length(8, { message: "O CEP deve ter 8 dígitos" }),
})

type FormSchema = z.infer<typeof FormSchema>

interface AddressData {
  uf: string
  localidade: string
  bairro: string
  logradouro: string
}

export const ZipCodeDialog: React.FC<{ dataValue?: { 
  value: string, 
  message: string,
  titleToast: string,
  descriptionToast: string,
} }> = ({ dataValue }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invalidCep, setInvalidCep] = useState<boolean>(false)
  const { setUser } = useUser()
  const { toast } = useToast()

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      zipCode: "",
    },
  })

  const handleChangeCep = async (zipCode: string) => {
    if (zipCode.length !== 8) {
      form.setError("zipCode", {
        type: "manual",
        message: "Informe um CEP válido"
      })
      if (invalidCep === false) setInvalidCep(true)
    } else {
      form.clearErrors("zipCode")
      const data = await viacep.getDataCep(zipCode)
      if (data?.erro && !!data.erro === true) {
        form.setError("zipCode", {
          type: "manual",
          message: "Informe um CEP válido"
        })
        if (invalidCep === false) setInvalidCep(true)
      } else {
        setInvalidCep(false)
        setAddressData(data)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (invalidCep) {
        form.setError("zipCode", {
          type: "manual",
          message: "Informe um CEP válido"
        })
        return
      }
      setIsLoading(true)
      setIsConfirmOpen(true)
    } catch {
      form.setError("zipCode", {
        type: "manual",
        message: "Erro ao buscar o CEP",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    toast({
      title: dataValue ? dataValue.titleToast : "CEP alterado",
      description: dataValue ? dataValue.descriptionToast : "CEP alterado com sucesso"
    })
    setIsConfirmOpen(false)
    setIsOpen(false)
    const data = {
      state: addressData?.uf ?? "",
      city: addressData?.localidade ?? "",
      neighborhood: addressData?.bairro ?? "",
      road: addressData?.logradouro ?? "",
      zipCode: form.getValues().zipCode
    }
    setUser((prev) => {
      if (!prev) return null

      return {
        ...prev,
        ...data
      }
    })
    await userService.updateUser(data)
    form.reset()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Editar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{ dataValue ? `Editar ${dataValue.value}` : "Editar CEP" }</DialogTitle>
            <DialogDescription>Atualize seu CEP. {dataValue ? dataValue.message : ""}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">CEP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="00000000"
                        className="h-9"
                        onChange={(e) => {
                          handleChangeCep(e.target.value)
                          field.onChange(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Buscando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar atualização de endereço</AlertDialogTitle>
            <AlertDialogDescription>
              Ao continuar seu endereço será atualizado para:
              {addressData && (
                <div className="mt-2 space-y-1 text-sm font-medium">
                  <p>
                    <span className="font-semibold">Estado:</span> {addressData.uf}
                  </p>
                  <p>
                    <span className="font-semibold">Cidade:</span> {addressData.localidade}
                  </p>
                  <p>
                    <span className="font-semibold">Bairro:</span> {addressData.bairro}
                  </p>
                  <p>
                    <span className="font-semibold">Rua:</span> {addressData.logradouro}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
