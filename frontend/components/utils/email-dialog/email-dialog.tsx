"use client"

import { Dialog, DialogTrigger, DialogDescription, DialogHeader, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { StepOne } from "./components/step-one/step-one"
import { StepTwo } from "./components/step-two/step-two"
import { useStep } from "./components/context/step-context"

export const EmailDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const { setStep, step } = useStep()
  
  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen)
    if (!isOpen) setStep(1)
  }   

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Alterar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Email</DialogTitle>
          <DialogDescription className="text-center">Atualize seu email. Este email será usado fazer login.</DialogDescription>
        </DialogHeader>
        {step === 1 ?
          <StepOne setEmail={setEmail}/> :
          <StepTwo email={email} setIsOpen={setIsOpen} />
        }
      </DialogContent>
    </Dialog>
  )
}