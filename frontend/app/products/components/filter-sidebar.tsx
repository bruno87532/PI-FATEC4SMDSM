"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

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
            {isOpen && <div className="mt-2">{children}</div>}
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
            <label htmlFor={id} className="ml-2 text-sm text-gray-700">
                {label}
            </label>
        </div>
    )
}

export function FilterSidebar() {
    return (
        <div className="w-64 flex-shrink-0">
            <div className="bg-white p-4 border rounded-lg">
                <h2 className="text-xl font-bold mb-4">Filters</h2>

                <FilterSection title="Market">
                    <CheckboxFilter id="market-covabra" label="Covabra" />
                    <CheckboxFilter id="market-pao-acucar" label="Pão de Açúcar" />
                    <CheckboxFilter id="market-carrefour" label="Carrefour" />
                    <CheckboxFilter id="market-dia" label="Dia" />
                    <CheckboxFilter id="market-sams" label="Sam's Club" />
                </FilterSection>

                <FilterSection title="Brand">
                    <CheckboxFilter id="brand-nestle" label="Nestlé" />
                    <CheckboxFilter id="brand-coca-cola" label="Coca Cola" />
                    <CheckboxFilter id="brand-sadia" label="Sadia" />
                    <CheckboxFilter id="brand-perdigao" label="Perdigão" />
                    <CheckboxFilter id="brand-seara" label="Seara" />
                    <CheckboxFilter id="brand-qualy" label="Qualy" />
                    <CheckboxFilter id="brand-danone" label="Danone" />
                    <CheckboxFilter id="brand-broto-legal" label="Broto Legal" />
                </FilterSection>

                <FilterSection title="Department">
                    <CheckboxFilter id="dept-produce" label="Produce" />
                    <CheckboxFilter id="dept-butcher" label="Butcher" />
                    <CheckboxFilter id="dept-bakery" label="Bakery" />
                    <CheckboxFilter id="dept-dairy" label="Dairy" />
                    <CheckboxFilter id="dept-grocery" label="Grocery" />
                    <CheckboxFilter id="dept-beverages" label="Beverages" />
                    <CheckboxFilter id="dept-cleaning" label="Cleaning" />
                    <CheckboxFilter id="dept-hygiene" label="Hygiene" />
                </FilterSection>

                <FilterSection title="Category">
                    <CheckboxFilter id="cat-rice-beans" label="Rice & Beans" />
                    <CheckboxFilter id="cat-pasta" label="Pasta" />
                    <CheckboxFilter id="cat-oils" label="Oils & Olive Oils" />
                    <CheckboxFilter id="cat-coffee" label="Coffee" />
                    <CheckboxFilter id="cat-sugar" label="Sugar & Sweeteners" />
                    <CheckboxFilter id="cat-cookies" label="Cookies & Crackers" />
                    <CheckboxFilter id="cat-frozen" label="Frozen Foods" />
                </FilterSection>

                <FilterSection title="Subcategory">
                    <CheckboxFilter id="subcat-rice" label="Rice" />
                    <CheckboxFilter id="subcat-beans" label="Beans" />
                    <CheckboxFilter id="subcat-sugar" label="Sugar" />
                    <CheckboxFilter id="subcat-sweetener" label="Sweetener" />
                    <CheckboxFilter id="subcat-olive-oil" label="Olive Oil" />
                    <CheckboxFilter id="subcat-oil" label="Oil" />
                </FilterSection>
            </div>
        </div>
    )
}
