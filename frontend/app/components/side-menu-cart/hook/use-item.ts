"use client"

import { useCart } from "@/app/context/cart-context"
import { useEffect, useCallback, useState } from "react"
import type { Item } from "@/type/item"
import { itemService } from "@/services/item"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/type/error"
import { productService } from "@/services/product"
import { userService } from "@/services/user"
import { ProductFromCart } from "@/type/product"

type GroupedData = Record<string, {
  idUser: string
  advertiserName: string
  products: ProductFromCart[]
  totalPrice: number
}>

export const useItem = (
  setData: React.Dispatch<React.SetStateAction<GroupedData>>
) => {
  const [idCarts, setIdCarts] = useState<string[] | null>(null)
  const { cart, setCart } = useCart()
  const { toast } = useToast()

  const getAdvertiserNameByIds = async (ids: string[]) => {
    const names = await userService.getAdvertiserNamesByIds(ids)
    let allUser: Record<string, string> = {}
    for (const name of names) {
      allUser[name.id] = name.advertiserName
    }
    return allUser
  }

  useEffect(() => {
    const getProductsByIds = async () => {
      if (!cart) return

      const ids = Object.values(cart).flatMap(itens => itens.map(item => item.idProduct))
      const products = await productService.getProductsByIds(ids)

      const uniqueIdUsers = Array.from(new Set(products.map(p => p.idUser)))
      const namesAndId = await getAdvertiserNameByIds(uniqueIdUsers)

      const groupedData: GroupedData = {}

      for (const product of products) {
        const idUser = product.idUser
        const advertiserName = namesAndId[idUser]
        const itemsInCart = Object.values(cart).flatMap(itens =>
          itens.filter(item => item.idProduct === product.id)
        )
        const quantity = itemsInCart.reduce((sum, item) => sum + item.quantity, 0)
        const price = quantity * (product.promotionalPrice ?? product.regularPrice ?? 0)

        if (!groupedData[idUser]) {
          groupedData[idUser] = {
            idUser,
            advertiserName,
            products: [],
            totalPrice: 0
          }
        }

        groupedData[idUser].products.push({
          id: product.id,
          name: product.name,
          regularPrice: product.regularPrice,
          ...(product.promotionalPrice && { promotionalPrice: product.promotionalPrice }),
          ...(product.promotionExpiration && { promotionExpiration: product.promotionExpiration }),
          ...(product.promotionStart && { promotionStart: product.promotionStart }),
          quantity
        })

        groupedData[idUser].totalPrice += price
      }

      setData(groupedData)
    }

    getProductsByIds()
  }, [cart])

  const createItem = useCallback(async (idProduct: string) => {
    if (!cart) return

    const item = await itemService.createItem(idProduct)
    const updatedCart = { ...cart }

    if (!updatedCart[item.idCart]) {
      updatedCart[item.idCart] = []
    }

    updatedCart[item.idCart].push(item)
    setCart(updatedCart)
  }, [cart, setCart])

  const decrementItem = useCallback(async (id: string) => {
    if (!cart) return

    await itemService.decrementItem(id)
    const updatedCart: Record<string, Item[]> = {}

    Object.entries(cart).forEach(([idCart, itens]) => {
      updatedCart[idCart] = itens.reduce<Item[]>((acc, item) => {
        if (item.id === id) {
          if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 })
        } else {
          acc.push(item)
        }
        return acc
      }, [])
    })

    setCart(updatedCart)
  }, [cart, setCart])

  const incrementItem = useCallback(async (id: string) => {
    if (!cart) return
    try {
      await itemService.incrementItem(id)
      const updatedCart: Record<string, Item[]> = {}

      Object.entries(cart).forEach(([idCart, itens]) => {
        updatedCart[idCart] = itens.map(item => {
          return item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        })
      })

      setCart(updatedCart)
    } catch (error) {
      if (error instanceof ApiError && error.message === "Product out of stock") {
        toast({
          title: "Produto fora de estoque",
          description:
            "Não foi possível adicionar o produto, produto sem estoque.",
        })
      }
    }
  }, [cart, setCart])

  const deleteItem = useCallback(async (id: string) => {
    if (!cart) return

    await itemService.deleteItem(id)
    const updatedCart: Record<string, Item[]> = {}

    Object.entries(cart).forEach(([idCart, itens]) => {
      updatedCart[idCart] = itens.filter(item => item.id !== id)
    })

    setCart(updatedCart)
  }, [cart, setCart])

  return { deleteItem, incrementItem, decrementItem, createItem }
}
