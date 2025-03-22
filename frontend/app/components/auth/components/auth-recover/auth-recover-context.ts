import React, { createContext, useContext } from "react";

interface ContextProps {
  setRecoverStep: React.Dispatch<React.SetStateAction<number>>;
  recoverStep: number;
  randomCode: string;
  setRandomCode: React.Dispatch<React.SetStateAction<string>>;
  idUser: string;
  setIdUser: React.Dispatch<React.SetStateAction<string>>
}

export const AuthRecoverContext = createContext<ContextProps | undefined>(undefined)

export const useAuthRecoverContext = () => {
  const context = useContext(AuthRecoverContext)
  if (!context) {
    throw new Error("The context must be used with a provider")
  }

  return context
}