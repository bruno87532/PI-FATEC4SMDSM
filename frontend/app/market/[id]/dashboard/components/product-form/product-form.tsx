"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { CalendarIcon, ImageIcon, Loader2, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRef } from "react"
import { MultiSelect } from "@/components/ui/multi-select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { maskPrice } from "@/utils/mask-price"

export const ProductForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPromotional, setIsPromotional] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const ProductSchema = z.object({
    name: z.string()
      .min(2, { message: "O nome do produto deve ter pelo menos 2 caracteres" })
      .max(100, { message: "O nome do produto deve ter no máximo 100 caracteres" }),
    description: z.string()
      .optional()
      .refine((value) => {
        if (value) {
          if (value.length < 2) {
            return false
          }
        }
        return true
      }, {
        message: "A descrição do produto deve ter pelo menos 2 caracteres",
      })
      .refine((value) => {
        if (value) {
          if (value.length > 256) {
            return false
          }
        }
        return true
      }, {
        message: "A descrição do produto deve ter no máximo 256 caracteres"
      }),
    regularPrice: z.string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "O preço deve ser um número positivo"
      }),
    promotionalPrice: z.string()
      .refine((val) => {
        if (isPromotional && !val) return false
        return true
      }, { message: "O preço promocional é obrigatório" }),
    promotionalExpiration: z.date()
      .refine((value) => {
        const now = new Date()
        if (now > value && isPromotional) return false
        return true
      }, {
        message: "A data de expiração da promoção deve ser uma data futura"
      }),
    promotionStart: z.date()
      .refine((value) => {
        const now = new Date()
        if (now > value && isPromotional) return false
        return true
      }, {
        message: "A data de início da promoção deve ser uma data futura"
      }),
    subCategory: z.array(z.string())
      .min(1, { message: "Pelo menos uma subcategoria deve ser selecionada" })
      .max(5, { message: "No máximo 5 subcategorias podem ser selecionadas" }),
    category: z.array(z.string())
      .min(1, { message: "Pelo menos uma categoria deve ser selecionada" })
      .max(5, { message: "No máximo 5 categorias podem ser selecionadas" }),
    stock: z.string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 10, {
        message: "O estoque deve ser um número positivo"
      }),
    image: z
      .instanceof(File, { message: "A imagem não pode estar vazia" })
      .refine((file) => file.type.startsWith('image/'), { message: 'O arquivo deve ser uma imagem.' })
  })

  type Product = z.infer<typeof ProductSchema>

  const productForm = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      regularPrice: "00.00",
      promotionalPrice: "00.00",
      promotionalExpiration: new Date(),
      promotionStart: new Date(),
      subCategory: [],
      category: [],
      stock: ""
    }
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    productForm.resetField("image")
  }

  const handleSubmit = async (data: Product) => {
    try {
    } catch (error) {

    }
  }

  const options = [
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'bebidas', label: 'Bebidas' },
    { value: 'limpeza', label: 'Produtos de Limpeza' },
    { value: 'higiene', label: 'Higiene Pessoal' },
    { value: 'hortifruti', label: 'Hortifruti' },
    { value: 'padaria', label: 'Padaria' },
    { value: 'congelados', label: 'Congelados' },
    { value: 'outros', label: 'Outros' },
  ]

  const [selectedCategorys, setSelectedCategorys] = useState<string[]>([])

  return (
    <Form {...productForm}>
      <form onSubmit={productForm.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={productForm.control}
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
                  control={productForm.control}
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
                    control={productForm.control}
                    name="regularPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input placeholder="00.00"
                            onChange={(e) => field.onChange(maskPrice(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="stock"
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
                  control={productForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={options}
                          onValueChange={(value) => field.onChange(value)}
                          placeholder="Categorias do produto"
                          variant="inverted"
                          animation={2}
                          maxCount={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={options}
                          onValueChange={(value) => field.onChange(value)}
                          placeholder="Sub categorias do produto"
                          variant="inverted"
                          animation={2}
                          maxCount={1}
                          {...field}
                        />
                      </FormControl>
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
                      {imagePreview ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={imagePreview}
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
                    <FormField
                      control={productForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-center items-center">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="product-image"
                              ref={(el) => {
                                fileInputRef.current = el;
                                field.ref(el);
                              }}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  field.onChange(file);
                                } else {
                                  field.onChange(undefined)
                                }
                                handleImageUpload(e);
                              }}
                            />

                          </FormControl>
                          <FormLabel htmlFor="product-image" className="cursor-pointer text-sm text-primary hover:underline">Selecionar imagem</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={isPromotional}
                      onCheckedChange={() => setIsPromotional(!isPromotional)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label>Produto em promoção</Label>
                      <p className="mt-2 text-sm text-muted-foreground">Marque esta opção para definir um preço promocional</p>
                    </div>
                  </div>

                  {isPromotional && (
                    <div className="space-y-4 pt-4">
                      <FormField
                        control={productForm.control}
                        name="promotionalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço Promocional (R$)</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00"
                                onChange={(e) => field.onChange(maskPrice(e.target.value))}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
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
                          control={productForm.control}
                          name="promotionalExpiration"
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
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar produto
          </Button>
        </div>
      </form>
    </Form>
  )
}

