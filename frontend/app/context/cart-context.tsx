"use client"

import React, { createContext, useContext, useState } from "react"

interface Item {
  id: string;
  idProduct: string;
  quantity: number;
  unitPrice: number;
  name: string;
  regularPrice: number;
}

type CartContextType = {
  cart: Item[]
  setCart: React.Dispatch<React.SetStateAction<Item[]>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Item[]>([]) 

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      { children }
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within an CartProvider")
  return context
}
