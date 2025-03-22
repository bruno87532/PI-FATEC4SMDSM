import { TabsContent } from "@radix-ui/react-tabs"
import { useState } from "react"
import { StepOne } from "./components/step-one/step-one"
import { StepTwo } from "./components/step-two/step-two"
import { StepThree } from "./components/step-three/step-three"
import { AuthRegisterContext } from "./auth-register-context"

export const AuthRegister = () => {
    const [registerStep, setRegisterStep] = useState<number>(1)
    const [idUser, setIdUser] = useState<string>("")
    const [randomCode, setRandomCode] = useState<string>("")

    return (
        <AuthRegisterContext.Provider value={{ registerStep, setRegisterStep, idUser, setIdUser, randomCode, setRandomCode }}>
            <TabsContent value="register">
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
            </TabsContent>
        </AuthRegisterContext.Provider>
    )
}