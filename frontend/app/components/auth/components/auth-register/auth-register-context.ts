import React, { createContext, useContext } from "react";

interface ContextProps {
  registerStep: number;
  setRegisterStep: React.Dispatch<React.SetStateAction<number>>;
  idUser: string;
  setIdUser: React.Dispatch<React.SetStateAction<string>>;
  randomCode: string;
  setRandomCode: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthRegisterContext = createContext<ContextProps | undefined>(undefined)

export const useAuthRegisterContext = () => {
  const context = useContext(AuthRegisterContext)
  if (!context) {
    throw new Error("The context must be used with a provider")
  }

  return context
}