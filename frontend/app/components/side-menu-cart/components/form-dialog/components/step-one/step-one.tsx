"use client"

import { DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { maskPhone } from "@/utils/mask-phone"
import { UseUserPayment } from "./hook/use-user-payment"
import type React from "react"
import { useState } from "react"
import { Select, SelectTrigger, SelectGroup, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useUser } from "@/app/context/user-context"

export const StepOne: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>
  setPhone: React.Dispatch<React.SetStateAction<string>>
}> = ({ setStep, setPhone }) => {
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false)

  const { isLoading, states, form, handleChangeCep, handleSubmit } = UseUserPayment(
    setIsLoadingButton,
    setPhone,
    setStep,
  )

  return (
    <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
      <DialogTitle className="text-xl font-bold text-green-700 mb-2">Informações para comprar</DialogTitle>
      <DialogDescription className="mb-4 text-gray-600">
        Por favor, preencha os dados abaixo para o estabelecimento realizar a entrega da mercadoria.
      </DialogDescription>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                        const maskedValue = maskPhone(value)
                        field.onChange(maskedValue)
                      }}
                      value={field.value}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(states).map(([name, abbr]) => (
                          <SelectItem key={abbr} value={abbr}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Sua cidade" className="h-9" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Seu bairro" className="h-9" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="road"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Rua</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sua rua" className="h-9" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="marketNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Número</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nº" className="h-9" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 pt-3 border-t border-green-100">
            <Button
              type="button"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors rounded-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              {isLoadingButton ? <Loader2 className="animate-spin h-6 w-6" /> : "Prosseguir"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )
}
