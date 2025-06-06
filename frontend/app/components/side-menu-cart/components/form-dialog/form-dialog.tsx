"use client"
import type React from "react"
import { useState } from "react"
import { StepOne } from "./components/step-one/step-one"
import { StepTwo } from "./components/step-two/step-two"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export const FormDialog: React.FC<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onComplete: () => void
}> = ({ isOpen, setIsOpen, onComplete }) => {
  const [step, setStep] = useState<number>(0)
  const [phone, setPhone] = useState<string>("")

  const handleComplete = () => {
    onComplete() 
    setIsOpen(false) 
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {step === 0 && <StepOne setStep={setStep} setPhone={setPhone} />}
        {step === 1 && (
          <StepTwo
            setIsOpen={setIsOpen}
            setStep={setStep}
            phone={phone}
            onComplete={handleComplete} 
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
