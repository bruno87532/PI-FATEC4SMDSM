import { UseFormReturn } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { maskPrice } from "@/utils/mask-price"
import React, { useState, useEffect } from "react"
import { MultiSelect } from "@/components/ui/multi-select"
import { categoryService } from "@/services/category"
import { subCategoryService } from "@/services/subCategory"
import { Loader2 } from "lucide-react"
import { Product as ProductType } from "../../schema/schema"

export const ProductDetails: React.FC<{ productForm: UseFormReturn<ProductType>; idCategories?: string[] | undefined; }> = ({ productForm, idCategories }) => {
  const [categories, setCategories] = useState<{
    value: string;
    label: string;
  }[] | null>(null)
  const [subCategories, setSubCategories] = useState<{
    value: string;
    label: string
  }[] | []>([])
  const [subCategoriesData, setSubCategoriesData] = useState<{
    value: string;
    label: string;
    idCategory: string;
  }[] | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      const [categories, subCategories] = await Promise.all([
        categoryService.getCategories(),
        subCategoryService.getSubCategories()
      ])

      const categoriesMap = categories.map((category) => {
        return {
          label: category.name,
          value: category.id
        }
      })
      const subCategoriesMap = subCategories.map((subCategory) => {
        return {
          label: subCategory.name,
          value: subCategory.id,
          idCategory: subCategory.idCategory
        }
      })

      setCategories(categoriesMap)
      setSubCategoriesData(subCategoriesMap)
    }

    fetchAll()
  }, [])

  useEffect(() => {
    if (idCategories) {
      const data = []
      if (!subCategoriesData) return
      for (const id of idCategories) {
        for (const subCategorie of subCategoriesData) {
          if (subCategorie.idCategory === id) {
            data.push({
              label: subCategorie.label,
              value: subCategorie.value
            })
          }
        }
      }
      setSubCategories(data)
    }
  }, [idCategories, subCategoriesData])

  const handleCategoriesChange = (ids: string[]) => {
    const data = []
    if (!subCategoriesData) return
    for (const id of ids) {
      for (const subCategorie of subCategoriesData) {
        if (subCategorie.idCategory === id) {
          data.push({
            label: subCategorie.label,
            value: subCategorie.value
          })
        }
      }
    }
    setSubCategories(data)
  }

  if (!categories || !subCategories) return (<Loader2 className="animate-spin h-10 w-10" />)

  return (
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
            name="categorys"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <MultiSelect
                    defaultValue={productForm.getValues().categorys ?? []}
                    options={categories}
                    onValueChange={
                      (value) => {
                        field.onChange(value)
                        handleCategoriesChange(value)
                      }
                    }
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
            name="subCategorys"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub categoria</FormLabel>
                <FormControl>
                  <MultiSelect
                    defaultValue={productForm.getValues().subCategorys ?? []}
                    disabled={subCategories?.length === 0}
                    options={subCategories ?? []}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
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
  )
}