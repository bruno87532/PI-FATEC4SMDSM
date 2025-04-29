export class HighlightProductsService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async featuredProductsHome() {
    try {
      const res = await fetch(this.pathBackend + "/highlight-products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("An error ocurred while organized products for the home")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while organized products for the home", error)
      throw error
    }
  }
}