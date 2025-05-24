export class HighlightProductsService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async featuredProductsHome() {
    try {
      const res = await fetch(this.pathBackend + "/highlight-products/home", {
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

  static async featuredProductsPage() {
    try {
      const res = await fetch(this.pathBackend + "/highlight-products/page", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("An error ocurred while organized products for the page")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while organized products for the home", error)
      throw error
    }
  }

  static async featuredProductsPageByPartialName(partialName: string) {
    try {
      const res = await fetch(this.pathBackend + "/highlight-products/page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ partialName })
      })

      if (!res.ok) throw new Error("An error ocurred while organized products for the page")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while organized products for the page", error)
      throw error
    }
  }

  static async featuredProductsHomeByPartialName(partialName: string) {
    try {
      const res = await fetch(this.pathBackend + "/highlight-products/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ partialName })
      })

      if (!res.ok) throw new Error("An error ocurred while organized products for the home")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while organized products for the home", error)
      throw error
    }
  }
}