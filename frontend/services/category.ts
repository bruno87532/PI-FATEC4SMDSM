export class categoryService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getCategories(): Promise<{
    id: string;
    name: string;
  }[]> {
    const res = await fetch(this.pathBackend + "/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    return await res.json()
  }
}