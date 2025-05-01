import { ApiError } from "@/type/error"

export class subscriptionCancellingService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async createSubscriptionCancelling(reason: string) {
    try {
      const res = await fetch(this.pathBackend + "/subscription-cancelling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ reason })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "Failed to create subscription cancelling")
      }

      if (!res.ok) throw new Error("Failed to create subscription cancelling")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while creating subscription cancelling", error)
      throw error
    }
  }
}