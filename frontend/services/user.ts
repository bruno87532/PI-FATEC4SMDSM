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
      console.error("An error ocurred while creating user", error)
      throw error
    }
  }

  static async getUserById() {
    try {
      const res = await fetch(this.pathBackend + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!res.ok) {
        throw new Error( "An error ocurred while creating user")
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while fetching user", error)
      throw error
    }
  }

  static async updateUser(data: {
    password?: string;
    name?: string;
    advertiserName?: string;
    email?: string;
    phone?: string;
  }) {
    try {
      const res = await fetch(this.pathBackend + "/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
      })

      if (!res.ok) throw new Error("Failed to update user")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while updating user", error)
      throw error
    }
  }

  static async haveUserWithAdvertiserName(advertiserName: string) {
    try {
      const res = await fetch(this.pathBackend + "/users/have-user-with-advertiser-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ advertiserName })
      })

      if (!res.ok) throw new Error("failed to check for user with this advertiser name")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while checking for the user with advertiser name")
      throw error
    }
  }

  static async emailIsEqual(email: string) {
    try {
      const res = await fetch(this.pathBackend + "/users/email-is-equal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email })
      })

      if (!res.ok) throw new Error("Failed to check user by email")
        
      return await res.json()
    } catch (error) {
      console.error("An error ocurred while checking for the user by email")
      throw error
    }
  }
}