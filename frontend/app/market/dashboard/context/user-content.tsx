"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Users } from "@/type/users"

type UsersContextType = {
  user: Users | null;
  setUser: React.Dispatch<React.SetStateAction<Users | null>>
}

const UserContext = createContext<UsersContextType | undefined>(undefined)

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Users | null>(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within an UserProvider")
  }
  return context
}