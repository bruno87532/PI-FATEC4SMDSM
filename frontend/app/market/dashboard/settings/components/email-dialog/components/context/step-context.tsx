import React, { createContext, useContext, useState, ReactNode } from "react";

type StepContextType = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
}

const StepContext = createContext<StepContextType | undefined>(undefined)

export const StepProvider = ({children}: { children: ReactNode }) => {
  const [step, setStep] = useState<number>(1)
  
  return (
    <StepContext.Provider value={{ setStep, step }}>
      { children }
    </StepContext.Provider>
  )
}

export const useStep = () => {
  const context = useContext(StepContext)
  if (!context) throw new Error("useStep must be used within an StepProvider")
  return context
}