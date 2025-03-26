"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CalendarIcon, ImageIcon, Loader2, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const productFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome do produto deve ter pelo menos 3 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O preço deve ser um número positivo",
  }),
  category: z.string({
    required_error: "Selecione uma categoria",
  }),
  inventory: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "O estoque deve ser um número não negativo",
  }),
  hasPromotion: z.boolean().default(false),
  promotionPrice: z.string().optional(),
  promotionStart: z.date().optional(),
  promotionEnd: z.date().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

const defaultValues: Partial<ProductFormValues> = {
  name: "",
  description: "",
  price: "",
  category: "",
  inventory: "",
  hasPromotion: false,
  promotionPrice: "",
}

interface ProductFormProps {
  productId?: string
}

export const ProductForm = ({ productId }: ProductFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Mock data for editing - in a real app, you would fetch this from an API
  const mockProduct = productId
    ? {
        id: productId,
        name: "Produto de Exemplo",
        description: "Esta é uma descrição detalhada do produto de exemplo.",
        price: "29.99",
        category: "alimentos",
        inventory: "50",
        hasPromotion: true,
        promotionPrice: "24.99",
        promotionStart: new Date(),
        promotionEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        image: "/placeholder.svg?height=200&width=200",
      }
    : null

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: mockProduct || defaultValues,
  })

  const hasPromotion = form.watch("hasPromotion")

  function onSubmit(data: ProductFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsLoading(false)
      router.push("/dashboard/produtos")
    }, 1000)
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function clearImage() {
    setImagePreview(null)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva seu produto em detalhes" className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque</FormLabel>
                        <FormControl>
                          <Input placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alimentos">Alimentos</SelectItem>
                          <SelectItem value="bebidas">Bebidas</SelectItem>
                          <SelectItem value="limpeza">Produtos de Limpeza</SelectItem>
                          <SelectItem value="higiene">Higiene Pessoal</SelectItem>
                          <SelectItem value="hortifruti">Hortifruti</SelectItem>
                          <SelectItem value="padaria">Padaria</SelectItem>
                          <SelectItem value="congelados">Congelados</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Imagem do Produto</Label>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative flex h-40 w-full items-center justify-center rounded-md border border-dashed">
                      {imagePreview || mockProduct?.image ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={imagePreview || mockProduct?.image || ""}
                            alt="Preview"
                            fill
                            className="object-contain p-2"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6 rounded-full bg-muted"
                            onClick={clearImage}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remover imagem</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Arraste uma imagem ou clique para fazer upload
                          </p>
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="product-image"
                      onChange={handleImageUpload}
                    />
                    <Label htmlFor="product-image" className="cursor-pointer text-sm text-primary hover:underline">
                      Selecionar imagem
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="hasPromotion"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Produto em promoção</FormLabel>
                            <FormDescription>Marque esta opção para definir um preço promocional</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {hasPromotion && (
                    <div className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="promotionPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço Promocional (R$)</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="promotionStart"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Início da Promoção</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: ptBR })
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="promotionEnd"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Fim da Promoção</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: ptBR })
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/produtos")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {productId ? "Atualizar Produto" : "Criar Produto"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

