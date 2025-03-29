
export class planService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getPlan() {
    try {
      const res = await fetch(this.pathBackend + "/plan", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error)
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while get plan")
      throw error
    }
  }
}