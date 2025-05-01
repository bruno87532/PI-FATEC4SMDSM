"use client"

import { useCart } from "@/app/context/cart-context"
import { useEffect, useCallback } from "react"
import { productService } from "@/services/product"
import { itemService } from "@/services/item"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/type/error"


export const useItem = () => {
  const { cart, setCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const getAllItensByIdUser = async () => {
      const itens = await itemService.getAllItensByIdUser()
      const itensComplete = await Promise.all(
        itens.map(async (item) => {
          const product = await productService.getProductById(item.idProduct)
          return {
            ...item,
            name: product.name,
            regularPrice: product.regularPrice
          }
        })
      )
      setCart(itensComplete)
    }

    getAllItensByIdUser()
  }, [])

  const decrementItem = useCallback(async (id: string) => {
    try {
      const item = cart.find((item) => item.id === id)
      if (item && item.quantity === 1) await itemService.deleteItem(id)
      else await itemService.decrementItem(id)

      setCart((prevCart) =>
        prevCart
          .map((cartItem) =>
            cartItem.id === id ?
              { ...cartItem, quantity: cartItem.quantity - 1 } :
              cartItem
          )
          .filter((item) => item.quantity !== 0)
      )
    } catch (error) {
      toast({
        title: "Erro interno",
        description: "Ocorreu um erro interno ao prosseguir com a sua solicitação. Por favor tente novamente mais tarde."
      })
    }
  }, [cart])

  const incrementItem = useCallback(async (id: string) => {
    try {
      await itemService.incrementItem(id)
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ?
            { ...item, quantity: item.quantity + 1 } :
            item
        )
      )
    } catch (error) {
      if (error instanceof ApiError && error.message === "Product out of stock") {
        toast({
          title: "Produto fora de estoque",
          description: "Não foi possível adicionar o produto, produto sem estoque."
        })
      } else {
        toast({
          title: "Erro interno",
          description: "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor tente novamente mais tarde."
        })
      }
    }
  }, [])

  const removeItem = useCallback(async (id: string) => {
    try {
      await itemService.deleteItem(id)
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== id))
    } catch (error) {
      toast({
        title: "Erro interno",
        description: "Ocorreu um erro interno e não foi possível prosseguir com a sua solicitação. Por favor tente novamente mais tarde."
      })
    }
  }, [])

  return { removeItem, incrementItem, decrementItem }
}