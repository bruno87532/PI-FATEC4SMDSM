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
import type React from "react"
import { useState, useCallback } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { viacep } from "@/services/viacep"
import { userService } from "@/services/user"
import { useUser } from "@/app/context/user-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

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

export const ZipCodeDialog: React.FC<{
  dataValue?: {
    value: string
    message: string
    titleToast: string
    descriptionToast: string
  }
}> = ({ dataValue }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
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

  // Reset form when dialog closes
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        form.reset()
        setAddressData(null)
        setInvalidCep(false)
        setIsLoading(false)
      }
    },
    [form],
  )

  const handleChangeCep = useCallback(
    async (zipCode: string) => {
      if (zipCode.length !== 8) {
        form.setError("zipCode", {
          type: "manual",
          message: "Informe um CEP válido",
        })
        if (invalidCep === false) setInvalidCep(true)
      } else {
        form.clearErrors("zipCode")
        try {
          const data = await viacep.getDataCep(zipCode)
          if (data?.erro && !!data.erro === true) {
            form.setError("zipCode", {
              type: "manual",
              message: "Informe um CEP válido",
            })
            if (invalidCep === false) setInvalidCep(true)
          } else {
            setInvalidCep(false)
            setAddressData(data)
          }
        } catch (error) {
          form.setError("zipCode", {
            type: "manual",
            message: "Erro ao buscar o CEP",
          })
          setInvalidCep(true)
        }
      }
    },
    [form, invalidCep],
  )

  const handleSubmit = useCallback(
    async (formData: FormSchema) => {
      if (invalidCep || !addressData) {
        form.setError("zipCode", {
          type: "manual",
          message: "Informe um CEP válido",
        })
        return
      }

      try {
        setIsLoading(true)

        const updateData = {
          state: addressData.uf ?? "",
          city: addressData.localidade ?? "",
          neighborhood: addressData.bairro ?? "",
          road: addressData.logradouro ?? "",
          zipCode: formData.zipCode,
        }

        await userService.updateUser(updateData)

        setUser((prev) => {
          if (!prev) return null
          return {
            ...prev,
            ...updateData,
          }
        })

        // Show what was changed in the toast
        const changedFields = []
        if (updateData.zipCode) changedFields.push(`CEP: ${updateData.zipCode}`)
        if (updateData.state) changedFields.push(`Estado: ${updateData.state}`)
        if (updateData.city) changedFields.push(`Cidade: ${updateData.city}`)
        if (updateData.neighborhood) changedFields.push(`Bairro: ${updateData.neighborhood}`)
        if (updateData.road) changedFields.push(`Rua: ${updateData.road}`)

        toast({
          title: dataValue ? dataValue.titleToast : "Endereço alterado",
          description: `${dataValue ? dataValue.descriptionToast : "Endereço alterado com sucesso"}. ${changedFields.join(", ")}`,
        })

        setIsOpen(false)
      } catch (error) {
        console.error("Error updating user:", error)
        toast({
          title: "Erro",
          description: "Erro ao atualizar endereço",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [invalidCep, addressData, dataValue, setUser, toast, form],
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dataValue ? `Editar ${dataValue.value}` : "Editar CEP"}</DialogTitle>
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

            {addressData && !invalidCep && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-2">Endereço encontrado:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Estado:</span> {addressData.uf}
                  </p>
                  <p>
                    <span className="font-medium">Cidade:</span> {addressData.localidade}
                  </p>
                  <p>
                    <span className="font-medium">Bairro:</span> {addressData.bairro}
                  </p>
                  <p>
                    <span className="font-medium">Rua:</span> {addressData.logradouro}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isLoading || invalidCep || !addressData}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
