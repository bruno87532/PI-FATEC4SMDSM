import { TabsContent } from "@radix-ui/react-tabs"
import { useState } from "react"
import { StepOne } from "./components/step-one/step-one"
import { StepTwo } from "./components/step-two/step-two"
import { StepThree } from "./components/step-three/step-three"

export const EmailDialog = () => {
  const [registerStep, setRegisterStep] = useState<number>(1)

  return (
    <div>
      {registerStep === 1 && (
        <>
          <StepOne />
        </>
      )}

      {registerStep === 2 && (
        <>
          <StepTwo />
        </>
      )}

      {registerStep === 3 && (
        <>
          <StepThree />
        </>
      )}
    </div>
  )
}