"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { StepOne } from "./components/step-one/step-one"
import { StepTwo } from "./components/step-two/step-two"

export const PhoneDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>("")
  const [step, setStep] = useState<number>(0)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      { step === 0 ? <StepOne setStep={setStep} setPhone={setPhone}/> : <StepTwo setIsOpen={setIsOpen} phone={phone} setStep={setStep}/> }
    </Dialog>
  )
}