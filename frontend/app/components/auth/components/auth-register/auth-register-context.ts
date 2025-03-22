import React, { createContext, useContext } from "react";

interface ContextProps {
  registerStep: number;
  setRegisterStep: React.Dispatch<React.SetStateAction<number>>
}

export const AuthRegisterContext = createContext<ContextProps | undefined>(undefined)

export const useAuthRegisterContext = () => {
  const context = useContext(AuthRegisterContext)
  if (!context) {
    throw new Error("The context must be used with a provider")
  }

  return context
}