"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app, you would fetch this from an API
const products = [
  {
    id: "1",
    name: "Café Especial Torrado",
    price: 29.99,
    promotionPrice: 24.99,
    hasPromotion: true,
    promotionEnd: "2023-12-31",
    category: "Alimentos",
    inventory: 45,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Azeite Extra Virgem Premium",
    price: 39.99,
    promotionPrice: null,
    hasPromotion: false,
    promotionEnd: null,
    category: "Alimentos",
    inventory: 30,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Chocolate Orgânico 70%",
    price: 12.99,
    promotionPrice: 9.99,
    hasPromotion: true,
    promotionEnd: "2023-11-15",
    category: "Alimentos",
    inventory: 100,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Vinho Tinto Reserva",
    price: 89.99,
    promotionPrice: null,
    hasPromotion: false,
    promotionEnd: null,
    category: "Bebidas",
    inventory: 15,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Queijo Artesanal",
    price: 24.99,
    promotionPrice: 19.99,
    hasPromotion: true,
    promotionEnd: "2023-11-30",
    category: "Alimentos",
    inventory: 25,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export const ProductsTable = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const { id } = useParams()

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.id))
    }
  }

  const toggleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleDeleteProduct = (id: string) => {
    // In a real app, you would call an API to delete the product
    console.log(`Deleting product ${id}`)
    setProductToDelete(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedProducts.length} selecionado(s)</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir produtos</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir {selectedProducts.length} produto(s)? Esta ação não pode ser
                    desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      selectedProducts.forEach((id) => handleDeleteProduct(id))
                      setSelectedProducts([])
                    }}
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="w-12">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelectProduct(product.id)}
                      aria-label={`Selecionar ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.hasPromotion ? (
                      <div>
                        <span className="text-muted-foreground line-through">R$ {product.price.toFixed(2)}</span>
                        <span className="ml-2 font-medium text-primary">R$ {product.promotionPrice?.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>R$ {product.price.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>{product.inventory} unid.</TableCell>
                  <TableCell>
                    {product.hasPromotion ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Em promoção
                      </Badge>
                    ) : product.inventory > 0 ? (
                      <Badge variant="outline">Disponível</Badge>
                    ) : (
                      <Badge variant="destructive">Sem estoque</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/market/${id}/dashboard/products/${product.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => setProductToDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog
                      open={productToDelete === product.id}
                      onOpenChange={(open) => !open && setProductToDelete(null)}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir produto</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

