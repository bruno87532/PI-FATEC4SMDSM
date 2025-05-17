import { ApiError } from "@/type/error"
import type { Item } from "@/type/item"

export class itemService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async createItem(idProduct: string): Promise<Item> {
    try {
      const res = await fetch(this.pathBackend + "/item", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idProduct })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "Failed to creating item")
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while creating item", error)
      throw error
    }
  }

  static async incrementItem(id: string): Promise<Item> {
    try {
      const res = await fetch(this.pathBackend + "/item/increment/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "Failed to creating item")
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while updating item", error)
      throw error
    }
  }

  static async decrementItem(id: string): Promise<Item> {
    try {
      const res = await fetch(this.pathBackend + "/item/decrement/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!res.ok) throw new Error("Failed to updating item")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while decrementing item", error)
      throw error
    }
  }

  static async deleteItem(id: string) {
    try {
      const res = await fetch(this.pathBackend + "/item/" + id, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("Failed to delete item")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while deleting item", error)
      throw error
    }
  }

  static async getAllItensByIdCarts(idCarts: string[]): Promise<{
    idCart: string;
    idProduct: string;
    quantity: number;
    unitPrice: number;
    id: string;
  }[]> {
    try {
      const res = await fetch(this.pathBackend + "/item/get-all-itens-by-id-carts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idCarts })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "An error ocurred while fetching itens")
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while fetching itens", error)
      throw error
    }
  }
}