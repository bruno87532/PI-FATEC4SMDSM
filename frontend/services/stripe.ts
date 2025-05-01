export class StripeService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND;

  static async createCheckout(price: string) {
    try {
      const res = await fetch(this.pathBackend + "/stripe/create-checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ price })
      });
      if (!res.ok) {
        throw new Error("Failed to create checkout");
      }
      const data = await res.json();
      return data.client_secret;
    } catch (error) {
      console.error("An error ocurred while creating checkout")
      throw error
    }
  }

  static async cancelSubscription() {
    try {
      const res = await fetch(this.pathBackend + "/stripe/cancel-subscription", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        throw new Error("Failed to cancel subscription")
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while canceling subscription", error)
      throw error
    }
  }

  static async reactivateSubscription() {
    try {
      const res = await fetch(this.pathBackend + "/stripe/reactivate-subscription", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        throw new Error("Failed to reactivate subscription")
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while reactivating subscription")
      throw error
    }
  }
}
