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

  static async authRecoverPassword(email: string) {
    const res = await fetch(this.pathBackend + "/auth/recover-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
      })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new ApiError(error.message || "An error ocurred while sending an email to recover password")
    }

    return await res.json()
  }

  static async authRecoverEmail(email: string) {
    const res = await fetch(this.pathBackend + "/auth/recover-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
      }),
      credentials: "include"
    })

    if (!res.ok) {
      const error = await res.json()
      throw new ApiError(error.message || "An error ocurred while sending an email to recover email")
    }

    return await res.json()
  }

  static async verifyRecoverPassword(data: {
    randomCode: string,
    idUser: string,
  }) {
    const res = await fetch(this.pathBackend + "/auth/verify-recover-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        randomCode: data.randomCode,
        idUser: data.idUser,
      })
    })
    if (!res.ok) {
      const error = await res.json();
      throw new ApiError(error.message || "An error ocurred while verify randomCode")
    }
    return await res.json()
  }

  static async verifyRecoverEmail(randomCode: string) {
    const res = await fetch(this.pathBackend + "/auth/verify-recover-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        randomCode
      }),
      credentials: "include"
    })
    if (!res.ok) {
      const error = await res.json();
      throw new ApiError(error.message || "An error ocurred while verify randomCode")
    }
    return await res.json()
  }

  static async changePassword(data: {
    password: string;
    idUser: string;
  }) {
    const { password, idUser } = data

    const res = await fetch(this.pathBackend + "/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idUser,
        password
      })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new ApiError(error.message || "An error ocurred while changing password")
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

  static async isAuthenticated() {
    const res = await fetch(this.pathBackend + "/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    if (!res.ok) {
      throw new Error("unauthenticated user")
    }

    return await res.json()
  }

  static async alterPassword(data: { oldPassword: string, newPassword: string }) {
    const res = await fetch(this.pathBackend + "/auth/alter-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const error = await res.json()
      throw new ApiError(error.message || "An error ocurred while checking the password for updating user")
    }

    return await res.json()
  }
}