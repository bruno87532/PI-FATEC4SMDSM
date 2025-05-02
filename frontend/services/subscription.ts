import { ApiError } from "@/type/error"

export class subscriptionService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getSubscriptionActiveByIdUser() {
    try {
      const res = await fetch(this.pathBackend + "/subscription", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      })

      if (!res.ok) throw new Error ("Failed to fetch subscription")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while fethcing subscription", error)
      throw error
    }
  }
}