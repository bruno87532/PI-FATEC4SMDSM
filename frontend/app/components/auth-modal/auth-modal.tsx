"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { SignUpForm } from "./components/sign-up.form"
import { LoginForm } from "./components/login-form"
import { RecoverPasswordForm } from "./components/recover-password-form"
import { AuthContext } from "./components/auth-context"

interface AuthModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, setOpen, onOpenChange }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "recover">("login")

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Autenticação</DialogTitle>
        </DialogHeader>
        <AuthContext.Provider value={{ setActiveTab }}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSuccess={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm onSuccess={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="recover">
              <RecoverPasswordForm onSuccess={() => setActiveTab("login")} onCancel={() => setActiveTab("login")} />
            </TabsContent>
          </Tabs>
        </AuthContext.Provider>
      </DialogContent>
    </Dialog>
  )
}

