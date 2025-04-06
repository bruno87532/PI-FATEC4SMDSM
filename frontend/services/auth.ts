import { ApiError } from "@/type/error"

export class authService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async verifyCode(data: { idUser: string; otp: string; }) {
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
      throw new ApiError(error.message || "An error ocurred while verify user")
    }

    return await res.json()
  }

  static async newPassword(data: { idUser: string, randomCode: string, password: string }) {
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
      throw new ApiError(error.message || "An error ocurred while creating new password")
    }

    return await res.json()
  }

  static async authRecover(email: string) {
    const res = await fetch(this.pathBackend + "/auth/recover", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        type: "PASSWORD"
      })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new ApiError(error.message || "An error ocurred while sending an email to recover password")
    }

    return await res.json()
  }

  static async verifyRecover(data: {
    randomCode: string,
    idUser: string,
    type: "PASSWORD" | "EMAIL"
  }) {
    const res = await fetch(this.pathBackend + "/auth/verify-recover", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        randomCode: data.randomCode,
        idUser: data.idUser,
        type: data.type
      })
    })
    if (!res.ok) {
      const error = await res.json();
      throw new ApiError(error.message || "An error ocurred while verify randomCode")
    }
    return await res.json()
  }

  static async changeEmailOrPassword(data: {
    email?: string;
    type: "PASSWORD" | "EMAIL";
    password?: string;
    idUser: string;
  }) {
    const { password, email, idUser, type } = data
    if (!password && !email) {
      throw new Error("Password or email are required")
    }

    const res = await fetch(this.pathBackend + "/auth/change", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idUser,
        type,
        ...(password ? { password } : { email })
      })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new ApiError(error.message || "An error ocurred while changing email or password")
    }

    return await res.json()
  }

  static async login(data: {
    email: string,
    password: string
  }) {
    const res = await fetch(this.pathBackend + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new ApiError(error.message || "An error ocurred while logging")
    }

    return await res.json()
  }
}