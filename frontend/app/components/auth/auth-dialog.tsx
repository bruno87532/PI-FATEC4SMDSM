"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { AuthLogin } from "./components/auth-login/auth-login"
import { AuthRegister } from "./components/auth-register/auth-register"
import { AuthRecover } from "./components/auth-recover/auth-recover"
import { AuthContext } from "./auth-context"

export const AuthDialog = () => {
    const [activeTab, setActiveTab] = useState<"login" | "recover" | "register">("login")


    return (
        <AuthContext.Provider value={{ activeTab, setActiveTab }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {activeTab === "login" ? "Login" : activeTab === "recover" ? "Recuperar Senha" : "Cadastro"}
                    </DialogTitle>
                    <DialogDescription>
                        {activeTab === "login"
                            ? "Entre com sua conta"
                            : activeTab === "recover" ?
                                "Siga os passos para recuperar sua senha" :
                                "Crie uma nova conta"
                        }
                    </DialogDescription>
                </DialogHeader>
                <Tabs className="w-full" value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "recover" | "register")}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Cadastro</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <AuthLogin />
                    </TabsContent>
                    <TabsContent value="register">
                        <AuthRegister />
                    </TabsContent>
                    <TabsContent value="recover">
                        <AuthRecover />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </AuthContext.Provider>
    )
}

