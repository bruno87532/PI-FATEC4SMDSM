import { subCategory } from "@/type/subCategories";

export class subCategoryService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getSubCategories(): Promise<subCategory[]> {
    try {
      const res = await fetch(this.pathBackend + "/subcategory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("An error ocurred while fetching subCategories")
      return await res.json()
    } catch (error) {
      console.error("An error ocurred while fetching subCategories", error)
      throw error
    }
  }
}