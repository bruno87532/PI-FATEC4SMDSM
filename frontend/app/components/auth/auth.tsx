"use client"

import { TabsTrigger, Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AuthLogin } from "./components/auth-login"
import { AuthSignup } from "./components/auth-signup"
import { AuthRecover } from "./components/auth-recover"
import { useAuthContext } from "./auth-context"

export const Auth = () => {
  const { setIsOpen, isOpen } = useAuthContext()

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Autenticação</DialogTitle>
        </DialogHeader>
        <Tabs className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthLogin />
          </TabsContent>
          <TabsContent value="signup">
            <AuthSignup />
          </TabsContent>
          <TabsContent value="recover">
            <AuthRecover />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}