"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/services/auth"

type AuthContextType = {
  isLoggedin: boolean;
  isLoading: boolean;
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const res = await authService.isAuthenticated()
        setIsLoggedin(true)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setIsLoggedin(false)
      }
    }

    isAuthenticated()
  })

  return (
    <AuthContext.Provider value={{ isLoggedin, isLoading, setIsLoggedin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}