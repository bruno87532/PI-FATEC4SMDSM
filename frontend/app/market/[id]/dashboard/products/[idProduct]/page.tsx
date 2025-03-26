"use client"

import type { Metadata } from "next"
import { ProductForm } from "../../components/product-form/product-form"
import { useParams } from "next/navigation"

const EditProductPage = () => {
  const { idProduct } = useParams()
  
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
        <p className="text-muted-foreground">Atualize os detalhes do produto</p>
      </div>

      <ProductForm productId={ idProduct as string} />
    </div>
  )
}

export default EditProductPage