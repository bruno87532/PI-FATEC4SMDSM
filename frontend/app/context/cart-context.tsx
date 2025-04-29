"use client"

import React, { createContext, useContext, useState } from "react"

interface Cart {
  id: string;
  regularPrice: number;
  promotionalPrice?: number;
  name: string;
  quantity: number;
}

type CartContextType = {
  cart: Cart[]
  setCart: React.Dispatch<React.SetStateAction<Cart[]>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart[]>([]) 

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
