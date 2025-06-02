"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, Filter, X, Plus } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { categoryService } from "@/services/category"
import { subCategoryService } from "@/services/subCategory"
import { useCategory } from "@/app/context/category-context"

export function CategoryFilters() {
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const { selectedCategoryIds, setSelectedCategoryIds, selectedSubcategoryIds, setSelectedSubcategoryIds } = useCategory()

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [subCategories, setSubCategories] = useState<
    { id: string; name: string; idCategory: string }[]
  >([])

  const [
    categoriesWithSubs,
    setCategoriesWithSubs,
  ] = useState<
    {
      id: string
      name: string
      subcategories: { id: string; name: string }[]
    }[]
  >([])

  const initialCategoriesCount = 6
  const displayedCategories = showAllCategories
    ? categoriesWithSubs
    : categoriesWithSubs.slice(0, initialCategoriesCount)

  useEffect(() => {
    const getCategories = async () => {
      const cats = await categoryService.getCategories()
      setCategories(cats)
    }

    const getSubCategories = async () => {
      const subs = await subCategoryService.getSubCategories()
      setSubCategories(subs)
    }

    getCategories()
    getSubCategories()
  }, [])

  useEffect(() => {
    if (categories.length === 0) return
    const merged = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      subcategories: subCategories
        .filter((sub) => sub.idCategory === cat.id)
        .map((sub) => ({ id: sub.id, name: sub.name })),
    }))
    setCategoriesWithSubs(merged)
  }, [categories, subCategories])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds((prev) =>
        prev.includes(categoryId) ? prev : [...prev, categoryId]
      )
    } else {
      setSelectedCategoryIds((prev) =>
        prev.filter((id) => id !== categoryId)
      )

      setSelectedSubcategoryIds((prevSubIds) =>
        prevSubIds.filter((subId) => {
          const sub = subCategories.find((s) => s.id === subId)
          return sub?.idCategory !== categoryId
        })
      )
    }
  }

  const handleSubcategoryChange = (
    subcategoryId: string,
    parentCategoryId: string,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedSubcategoryIds((prev) =>
        prev.includes(subcategoryId) ? prev : [...prev, subcategoryId]
      )
      if (!selectedCategoryIds.includes(parentCategoryId)) {
        setSelectedCategoryIds((prev) => [...prev, parentCategoryId])
      }
    } else {
      setSelectedSubcategoryIds((prev) =>
        prev.filter((id) => id !== subcategoryId)
      )
    }
  }

  const clearAllFilters = () => {
    setSelectedCategoryIds([])
    setSelectedSubcategoryIds([])
  }

  const totalFilters =
    selectedCategoryIds.length + selectedSubcategoryIds.length

  const getCategoryNameById = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    return cat ? cat.name : id
  }
  const getSubcategoryNameById = (id: string) => {
    const sub = subCategories.find((s) => s.id === id)
    return sub ? sub.name : id
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Filter className="text-white h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
            <p className="text-gray-500 text-sm">
              Encontre exatamente o que procura
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalFilters > 0 && (
            <>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {totalFilters} filtro{totalFilters > 1 ? "s" : ""}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="md:hidden"
          >
            {isFiltersOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {totalFilters > 0 && (
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {selectedCategoryIds.map((catId) => (
              <Badge
                key={catId}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer whitespace-nowrap flex-shrink-0"
                onClick={() => handleCategoryChange(catId, false)}
              >
                {getCategoryNameById(catId)}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedSubcategoryIds.map((subId) => (
              <Badge
                key={subId}
                variant="secondary"
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer whitespace-nowrap flex-shrink-0"
                onClick={() => {
                  const parent = subCategories.find((s) => s.id === subId)
                  if (parent) {
                    handleSubcategoryChange(subId, parent.idCategory, false)
                  }
                }}
              >
                {getSubcategoryNameById(subId)}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className={`${isFiltersOpen ? "block" : "hidden"} md:block`}>
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedCategories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <Collapsible open={openCategories.includes(category.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategoryIds.includes(category.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(
                            category.id,
                            checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-semibold text-gray-900 cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {openCategories.includes(category.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center space-x-2 ml-4"
                      >
                        <Checkbox
                          id={`subcat-${subcategory.id}`}
                          checked={selectedSubcategoryIds.includes(
                            subcategory.id
                          )}
                          onCheckedChange={(checked) =>
                            handleSubcategoryChange(
                              subcategory.id,
                              category.id,
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={`subcat-${subcategory.id}`}
                          className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                        >
                          {subcategory.name}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>

          {categoriesWithSubs.length > initialCategoriesCount && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {showAllCategories ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Ver menos categorias
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ver mais {categoriesWithSubs.length - initialCategoriesCount}{" "}
                    categorias
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
