import { Category } from "@/type/categories";

export class categoryService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getCategories(): Promise<Category[]> {
    const res = await fetch(this.pathBackend + "/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    return await res.json()
  }
}