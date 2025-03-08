import { createContext, useContext } from "react";

interface ContextProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

export const AuthContext = createContext<ContextProps | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("The context must be used with a provider")
  }
  return context
}