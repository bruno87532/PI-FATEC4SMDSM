"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { categoryService } from "@/services/category"
import { subCategoryService } from "@/services/subCategory"
import { productService } from "@/services/product"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ProductPage, ProductDb } from "@/type/product"

export const ProductsTable = () => {
  const [products, setProducts] = useState<ProductPage[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 20

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true)
      try {
        const rawProducts: ProductDb[] = await productService.getProducts(currentPage, limit)
        const [categoriesData, subCategoriesData] = await Promise.all([
          categoryService.getCategories(),
          subCategoryService.getSubCategories(),
        ])
        const categoryMap = new Map(categoriesData.map(c => [c.id, c.name]))
        const subCategoryMap = new Map(subCategoriesData.map(sc => [sc.id, sc.name]))

        const mapped: ProductPage[] = rawProducts.map(product => {
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
        setProducts(mapped)
      } catch (error) {
        console.error("Erro ao buscar produtos paginados", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPage()
  }, [currentPage])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleDeleteProduct = async (ids: string[]) => {
    try {
      await productService.deleteProductByIds(ids)
      setProducts(products.filter(p => !ids.includes(p.id)))
      const isMany = ids.length > 1
      toast({
        title: isMany ? "Produtos deletados" : "Produto deletado",
        description: isMany
          ? "Seus produtos foram deletados com sucesso"
          : "Seu produto foi deletado com sucesso"
      })
    } catch (error) {
      toast({
        title: "Erro interno.",
        description: "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor, tente novamente mais tarde."
      })
      console.error("Erro ao deletar produtos", error)
    }
    setProductToDelete(null)
    setSelectedProducts([])
  }

  const now = new Date()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedProducts.length} selecionado(s)</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir produtos</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir {selectedProducts.length} produto(s)? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteProduct(selectedProducts)}>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">Carregando...</TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">Nenhum produto encontrado.</TableCell>
              </TableRow>
            ) : (
              filteredProducts.map(product => (
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
                      src={`https://drive.google.com/uc?export=view&id=${product.idDrive}`}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.nameCategories.join(", ")}</TableCell>
                  <TableCell>{product.nameSubCategories.join(", ")}</TableCell>
                  <TableCell>
                    {product.promotionExpiration && product.promotionalPrice && product.promotionExpiration.getTime() > now.getTime() ? (
                      <div><span className="text-muted-foreground line-through">R$ {product.regularPrice.toFixed(2)}</span><span className="ml-2 font-medium text-primary"> R$ {product.promotionalPrice.toFixed(2)}</span></div>
                    ) : (
                      <span>R$ {product.regularPrice.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>{product.stock} unid.</TableCell>
                  <TableCell>
                    {product.promotionExpiration && product.promotionalPrice && product.promotionExpiration.getTime() > now.getTime() ? (
                      <Badge variant="secondary">Em promoção</Badge>
                    ) : product.stock > 0 ? (
                      <Badge variant="outline">Disponível</Badge>
                    ) : (
                      <Badge variant="destructive">Sem estoque</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href={`/market/dashboard/products/${product.id}`}><Edit className="mr-2 h-4 w-4" />Editar</Link></DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => setProductToDelete(product.id)}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog open={productToDelete === product.id} onOpenChange={open => !open && setProductToDelete(null)}>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Excluir produto</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteProduct([product.id])}>Excluir</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center space-x-2 mt-4">
        <Button size="sm" disabled={currentPage === 1 || isLoading} onClick={() => setCurrentPage(p => p - 1)}>Anterior</Button>
        <span>Página {currentPage}</span>
        <Button size="sm" disabled={products.length < limit || isLoading} onClick={() => setCurrentPage(p => p + 1)}>Próxima</Button>
      </div>
    </div>
  )
}
