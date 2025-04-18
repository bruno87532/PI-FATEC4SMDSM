import { subCategory } from "@/type/subCategories";

export class subCategoryService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getSubCategories(): Promise<subCategory[]> {
    const res = await fetch(this.pathBackend + "/subcategory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    return await res.json()
  }
}