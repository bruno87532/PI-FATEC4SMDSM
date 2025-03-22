import React, { createContext, useContext } from "react";

interface ContextProps {
  activeTab: "login" | "recover" | "register";
  setActiveTab: React.Dispatch<React.SetStateAction<"login" | "recover" | "register">>
}

export const AuthContext = createContext<ContextProps | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("The context must be used with a provider")
  }

  return context
}
