"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { categoryService } from "@/services/category"
import { subCategoryService } from "@/services/subCategory"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductPage, ProductDb } from "@/type/product"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { productService } from "@/services/product"
import { useToast } from "@/hooks/use-toast"

export const ProductsTable = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductPage[] | []>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsData, categoriesData, subCategoriesData] = await Promise.all([
          productService.getProductsById(),
          categoryService.getCategories(),
          subCategoryService.getSubCategories()
        ])
        const categoryMap = new Map(categoriesData.map(c => [c.id, c.name]))
        const subCategoryMap = new Map(subCategoriesData.map(sc => [sc.id, sc.name]))
        const data: ProductPage[] = productsData.map(product => {
          const nameCategories = product.categorys
            .map(c => categoryMap.get(c.id))
            .filter(Boolean) as string[]

          const nameSubCategories = product.subCategorys
            .map(sc => subCategoryMap.get(sc.id))
            .filter(Boolean) as string[]
          return {
            id: product.id,
            idDrive: product.idDrive,
            name: product.name,
            stock: product.stock,
            description: product.description ?? undefined,
            regularPrice: product.regularPrice / 100,
            promotionalPrice: product.promotionalPrice ? product.promotionalPrice / 100 : undefined,
            promotionExpiration: product.promotionExpiration ? new Date(product.promotionExpiration) : undefined,
            promotionStart: product.promotionStart ? new Date(product.promotionStart) : undefined,
            nameCategories,
            nameSubCategories,
          }
        })
        setProducts(data)
      } catch (error) {
        console.error("An error ocurred while organizing products", error)
      }
    }

    fetchAll()
  }, [])
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  
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

  const handleDeleteProduct = async (ids: string[]) => {
    try {
      await productService.deleteProductByIds(ids)
      setProducts(products.filter(product => !ids.includes(product.id)))
      const isManyProduct = ids.length > 1
      toast({
        title: isManyProduct ? "Produtos deletados" : "Produto deletado",
        description: isManyProduct ? "Seus produtos foram deletados com sucesso" : "Seu produto foi deletado com sucesso"
      })
    } catch (error) {
      toast({
        title: "Erro interno",
        description: "Devido a problemas técnicos não foi possível deletar o produto. Tente novamente mais tarde"
      })
      console.error("An error ocurred while deleting products", error)
    }
    setProductToDelete(null)
  }
  const now = new Date()
  
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
                      const ids = selectedProducts.map(id => id)
                      handleDeleteProduct(ids)
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
              <TableHead>Sub categoria</TableHead>
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
                      src={"https://drive.google.com/uc?export=view&id=" + product.idDrive}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{ product.nameCategories.join(", ") }</TableCell>
                  <TableCell>{ product.nameSubCategories.join(", ") }</TableCell>
                  <TableCell>
                    {product.promotionExpiration && product.promotionalPrice && product.promotionExpiration.getTime() > now.getTime() ? (
                      <div>
                        <span className="text-muted-foreground line-through">R$ {product.regularPrice.toFixed(2)}</span>
                        <span className="ml-2 font-medium text-primary">R$ {product.promotionalPrice.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>R$ {product.regularPrice.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>{product.stock} unid.</TableCell>
                  <TableCell>
                    {product.promotionExpiration && product.promotionalPrice && product.promotionExpiration.getTime() > now.getTime() ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Em promoção
                      </Badge>
                    ) : product.stock > 0 ? (
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
                          <Link href={`/market/100/dashboard/products/${product.id}`}>
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
                          <AlertDialogAction onClick={() => handleDeleteProduct([product.id])}>Excluir</AlertDialogAction>
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

