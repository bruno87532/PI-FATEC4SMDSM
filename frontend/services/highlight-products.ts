export class HighlightProductsService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async featuredProductsHome() {
    const res = await fetch(this.pathBackend + "/highlight-products/home", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) return

    return await res.json()
  }

  static async featuredProductsPage() {
    const res = await fetch(this.pathBackend + "/highlight-products/page", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) return

    return await res.json()
  }

  static async featuredProductsPageByPartialName(partialName: string) {
    const res = await fetch(this.pathBackend + "/highlight-products/page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ partialName })
    })

    if (!res.ok) return

    return await res.json()
  }

  static async featuredProductsHomeByPartialName(partialName: string) {
    const res = await fetch(this.pathBackend + "/highlight-products/home", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ partialName })
    })

    if (!res.ok) return

    return await res.json()
  }
}