"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { Category } from "@/type/categories"
import { useProduct } from "../context/use-products"

type FilterSectionProps = {
  title: string
  children: React.ReactNode
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-b pb-4">
      <button className="flex items-center justify-between w-full py-2 font-medium" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="mt-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">{children}</div>}
    </div>
  )
}

type CheckboxFilterProps = {
  id: string
  label: string
}

const CheckboxFilter = ({ id, label }: CheckboxFilterProps) => {
  return (
    <div className="flex items-center mb-2">
      <input type="checkbox" id={id} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
      <label htmlFor={id} className="ml-2 text-sm text-gray-700 truncate">
        {label}
      </label>
    </div>
  )
}

export const FilterSidebar: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const { products, isLoading } = useProduct()

  if (isLoading) return null
  const names = Object.keys(Object.entries(products)[0][1])

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white p-4 border rounded-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white pt-1 pb-2">Filters</h2>

        <FilterSection title="Market">
          {names.map((name) => (
            <CheckboxFilter key={name} id={name} label={name} />
          ))}
        </FilterSection>
        <FilterSection title="Category">
          {categories.map((category) => (
            <CheckboxFilter key={category.id} id={category.id} label={category.name} />
          ))}
        </FilterSection>
      </div>
    </div>
  )
}
