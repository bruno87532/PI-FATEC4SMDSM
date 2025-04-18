export class subCategoryService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getSubCategories(): Promise<{
    id: string;
    name: string;
    idCategory: string
  }[]> {
    const res = await fetch(this.pathBackend + "/subcategory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    return await res.json()
  }
}