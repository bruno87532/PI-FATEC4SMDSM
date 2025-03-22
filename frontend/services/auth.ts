import { ApiError } from "@/type/error"

export class authService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async verifyCode(data: {idUser: string; otp: string;}) {
    try {
      const res = await fetch(this.pathBackend + "/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          randomCode: data.otp,
          idUser: data.idUser
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "An error ocurred while verify user", 400)
      }

      return await res.json()
    } catch (error) {
      throw error
    }
  }

  static async newPassword(data: { idUser: string, randomCode: string, password: string }) {
    try {
      const res = await fetch(this.pathBackend + "/auth/new-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idUser: data.idUser, 
          randomCode: data.randomCode, 
          password: data.password 
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "An error ocurred while creating new password", 400)
      }

      return await res.json()
    } catch (error) {
      throw error
    }
  }
}