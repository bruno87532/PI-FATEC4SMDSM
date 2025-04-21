import { Category } from "@/type/categories";

export class categoryService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(this.pathBackend + "/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if (!res.ok) throw new Error ("An error ocurred while fetching categories")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while fetching categories", error)
      throw error
    }
  }
}