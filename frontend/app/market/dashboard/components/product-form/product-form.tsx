"use client"

import { Loader2 } from "lucide-react"
import type React from "react"
import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { productService } from "@/services/product"
import { useToast } from "@/hooks/use-toast"
import { ProductDb } from "@/type/product"
import { ProductDetails } from "./components/product-details/product-details"
import { ProductImage } from "./components/product-image/product-image"
import { createSchema } from "./schema/schema"
import { ProductPromotion } from "./components/product-promotion/product-promotion"
import { Product } from "./schema/schema"
import { useProductData } from "./hook/use-product-data"
import { ApiError } from "@/type/error"
import { ProductCsv } from "./components/product-csv/product-csv"

export const ProductForm = ({ product }: { product?: ProductDb }) => {
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPromotional, setIsPromotional] = useState<boolean>(false)

  const ProductSchema = createSchema(isPromotional)
  const { regularPriceDb, categoryDb, subCategoryDb, file, promotionalPrice, promotionExpiration, promotionStart, loading } = useProductData(product, setIsPromotional)

  const productForm = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      regularPrice: regularPriceDb ?? "00.00",
      subCategorys: subCategoryDb ?? [],
      categorys: categoryDb ?? [],
      stock: product?.stock.toString() ?? "",
      promotionalPrice: promotionalPrice?.toString() ?? "",
      promotionExpiration: promotionExpiration ? new Date(promotionExpiration) : new Date(),
      promotionStart: promotionStart ? new Date(promotionStart) : new Date()
    }
  })

  const title = product ?
    "Produto atualizado" :
    "Produto cadastrado"

  const description = product ?
    "O seu produto foi atualizado com sucesso" :
    "O seu produto foi criado com sucesso"

  const functionToCall = product ?
    async (data: Product) => await productService.updateProduct(data, product.id) :
    async (data: Product) => await productService.createProduct(data)

  const handleSubmit = async (data: Product) => {
    try {
      setIsLoading(true)
      data.regularPrice = (parseFloat(data.regularPrice) * 100).toFixed(0)
      if (data.promotionalPrice) data.promotionalPrice = (parseFloat(data.promotionalPrice) * 100).toFixed(0)
      await functionToCall(data)
      toast({
        title,
        description
      })
    } catch (error) {
      if (error instanceof ApiError && error.message === "The image and width must be equal") {
        productForm.setError("file", {
          type: "manual", 
          message: "A imagem deve ter dimensões iguais"
        })
      }
    } finally {      
      setIsLoading(false)
    }
  }

  if (loading) return <Loader2 className="animate-spin h-10 w-10" />

  return (
    <Form {...productForm}>
      <form onSubmit={productForm.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductDetails productForm={productForm} idCategories={categoryDb} />
          <div className="space-y-8">
            <ProductImage image={file} productForm={productForm} />
            <ProductPromotion
              isPromotional={isPromotional}
              setIsPromotional={setIsPromotional}
              productForm={productForm}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && "Criar produto"}
          </Button>
        </div>
      </form>
      <ProductCsv />
    </Form>
  )
}
