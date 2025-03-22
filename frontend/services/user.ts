import { ApiError } from "@/type/error";

export class userService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async createUser(data: { email: string, name: string }) {
    try {
      const res = await fetch(this.pathBackend + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email
        })
      })

      if (!res.ok) {
        const error = await res.json();
        throw new ApiError(error.message || "An error ocurred while creating user", 400)
      }

      return await res.json()
    } catch (error) {
      throw error
    }
  }
}