
"use client"

import React, { createContext, useContext, useState } from "react";

type IsLoginOpenType = {
  isLoginOpen: boolean;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const IsLoginOpenContext = createContext<IsLoginOpenType | undefined>(undefined)

export const IsLoginOpenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false)
  
  return (
    <IsLoginOpenContext.Provider value={{ isLoginOpen, setIsLoginOpen }}>
      { children }
    </IsLoginOpenContext.Provider>
  )
}

export const useIsLoginOpen = () => {
  const context = useContext(IsLoginOpenContext)
  if (!context) throw new Error("useIsLoginOpen must be used within an IsLoginOpenProvider")
  return context
}