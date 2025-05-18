"use client"
import type React from "react"
import { useState } from "react"
import { StepOne } from "./components/step-one/step-one"
import { StepTwo } from "./components/step-two/step-two"

export const FormDialog: React.FC<{ setIsUserAdvertiser: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setIsUserAdvertiser,
}) => {
  const [step, setStep] = useState<number>(0)
  const [phone, setPhone] = useState<string>("") 

  return (
    <div>
      {step === 0 && (
        <StepOne setStep={setStep} setPhone={setPhone}/>
      )}
      {step === 1 && (
        <StepTwo setStep={setStep} phone={phone} setIsUserAdvertiser={setIsUserAdvertiser}/>
      )}
    </div>
  )
}
