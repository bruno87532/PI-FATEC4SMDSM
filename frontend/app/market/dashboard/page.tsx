import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsTable } from "./components/products-table/product-table"

export const metadata: Metadata = {
  title: "Painel do Anunciante",
  description: "Gerencie seus produtos e anúncios",
}

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel do Anunciante</h1>
          <p className="text-muted-foreground">Gerencie seus produtos</p>
        </div>
        <Link href="/market/dashboard/products/new">
          <Button>Adicionar Produto</Button>
        </Link>
      </div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Seus Produtos</CardTitle>
          <CardDescription>Gerencie todos os seus produtos. Clique em um produto para editá-lo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable />
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard