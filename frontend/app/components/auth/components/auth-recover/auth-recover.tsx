import { useState } from "react"
import { StepOne } from "./components/step-one/step-one"
import { StepTwo } from "./components/step-two/step-two"
import { StepThree } from "./components/step-three/step-three"
import { AuthRecoverContext } from "./auth-recover-context"

export const AuthRecover = () => {
  const [recoverStep, setRecoverStep] = useState<number>(1)
  const [idUser, setIdUser] = useState<string>("")
  const [randomCode, setRandomCode] = useState<string>("")

  return (
    <AuthRecoverContext.Provider value={{ recoverStep, setRecoverStep, idUser, setIdUser, randomCode, setRandomCode }}>
      {recoverStep === 1 && (
        <>
          <StepOne />
        </>
      )}

      {recoverStep === 2 && (
        <>
          <StepTwo />
        </>
      )}

      {recoverStep === 3 && (
        <>
          <StepThree />
        </>
      )}
    </AuthRecoverContext.Provider>
  )
}