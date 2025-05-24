"use client"

import { useEffect, useState } from "react"
import { ProductForm } from "../../components/product-form/product-form"
import { useParams } from "next/navigation"
import { productService } from "@/services/product"
import { useToast } from "@/hooks/use-toast"
import { ProductDb } from "@/type/product"
import { Loader2 } from "lucide-react"

const EditProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductDb | null>(null)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const getProductById = async () => {
      if (typeof id !== "string") throw new Error("The id must be a string")
      const productDb = await productService.getProductById(id)
      setProduct(productDb)
      setIsLoading(false)
    }

    getProductById()
  }, [])

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
        <p className="text-muted-foreground">Atualize os detalhes do produto</p>
      </div>

      {isLoading || !product ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : <ProductForm product={product} />}
    </div>
  )
}

export default EditProductPage