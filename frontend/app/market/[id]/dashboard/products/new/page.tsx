import type { Metadata } from "next"
import { ProductForm } from "../../components/product-form/product-form"

export const metadata: Metadata = {
  title: "Adicionar Produto",
  description: "Adicione um novo produto ao seu catálogo",
}

const NewProductPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adicionar Produto</h1>
        <p className="text-muted-foreground">Preencha os detalhes do novo produto</p>
      </div>

      <ProductForm />
    </div>
  )
}

export default NewProductPage