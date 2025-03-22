import { TabsContent } from "@radix-ui/react-tabs"
import { useState } from "react"
import { StepOne } from "./components/step-one"
import { StepTwo } from "./components/step-two"
import { StepThree } from "./components/step-three"
import { AuthRegisterContext } from "./auth-register-context"

export const AuthRegister = () => {
    const [registerStep, setRegisterStep] = useState<number>(1)

    return (
        <AuthRegisterContext.Provider value={{ registerStep, setRegisterStep }}>
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