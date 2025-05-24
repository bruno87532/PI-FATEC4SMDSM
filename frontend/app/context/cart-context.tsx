"use client"

import React, { createContext, useEffect, useContext, useState } from "react"
import type { Item } from "@/type/item"
import { itemService } from "@/services/item"
import { CartService } from "@/services/cart"

type CartContextType = {
  cart: Record<string, Item[]> | null
  setCart: React.Dispatch<React.SetStateAction<Record<string, Item[]> | null>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Record<string, Item[]> | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const carts = await CartService.getCartsByIdUser()
      if (!carts) return
      const ids = carts.map(cart => cart.id)

      const itens = await itemService.getAllItensByIdCarts(ids)
      const allItens: Record<string, Item[]> = {}

      itens.forEach(item => {
        if (!allItens[item.idCart]) {
          allItens[item.idCart] = []
        }
        allItens[item.idCart].push(item)
      })

      setCart(allItens)
    }

    fetchData()
  }, [])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within an CartProvider")
  return context
}
