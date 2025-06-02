
"use client"

import React, { createContext, useContext, useState } from "react";

type CategoryType = {
  selectedCategoryIds: string[];
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSubcategoryIds: string[];
  setSelectedSubcategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryContext = createContext<CategoryType | undefined>(undefined)

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([])

  return (
    <CategoryContext.Provider value={{ selectedCategoryIds, setSelectedCategoryIds, selectedSubcategoryIds, setSelectedSubcategoryIds }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategory = () => {
  const context = useContext(CategoryContext)
  if (!context) throw new Error("useCatgegory must be used withi an CategoryProvider")
  return context
}