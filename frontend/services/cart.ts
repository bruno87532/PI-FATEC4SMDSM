export class CartService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getCartsByIdUser(): Promise<{ id: string; totalPrice: number }[] | undefined> {
    try {
      const res = await fetch(this.pathBackend + "/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "An error ocurred while fetching cart")
      }

      return await res.json()
    }  catch (error) {
      return
    }
  }
}