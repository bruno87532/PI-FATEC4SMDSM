"use client"

import React, { createContext, useEffect, useContext, useState } from "react"
import type { User } from "@/type/users"
import { userService } from "@/services/user"

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUserById = async () => {
      const user = await userService.getUserById()
      setUser(user)
    }

    getUserById()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within an UserProvider")
  return context
}
