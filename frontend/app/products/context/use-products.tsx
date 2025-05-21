import React, { createContext, useEffect, useContext, useState } from "react";
import { ProductDb } from "@/type/product";
import { HighlightProductsService } from "@/services/highlight-products";

type ProductContext = {
  products: Record<string, Record<string, ProductDb[]>>
  setProducts: React.Dispatch<Record<string, Record<string, ProductDb[]>>>
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductContext = createContext<ProductContext | undefined>(undefined)

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Record<string, Record<string, ProductDb[]>>>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  console.log(products)
  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await HighlightProductsService.featuredProductsHome()
      setProducts(fetchedProducts)
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <ProductContext.Provider value={{ products, setProducts, isLoading, setIsLoading }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error("useProduct must be used within an ProductProvider")
  return context
}