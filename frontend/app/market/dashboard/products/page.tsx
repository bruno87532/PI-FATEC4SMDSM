"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsTable } from "../components/products-table/product-table"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus produtos e promoções</p>
        </div>
        <Link href="/market/dashboard/products/new">
          <Button onClick={() => setIsLoading(true)}>
            { isLoading ? <Loader2 className="animate-spin h-6 w-6"/> : "Adicionar Produto" }
          </Button>
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

