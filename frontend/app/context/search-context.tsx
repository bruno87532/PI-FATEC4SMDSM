"use client"

import React, { createContext, useContext, useState } from "react"

type SearchContextType = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState<string>("")

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) throw new Error("useSearch must be used within an SearchProvider")
  return context
}
