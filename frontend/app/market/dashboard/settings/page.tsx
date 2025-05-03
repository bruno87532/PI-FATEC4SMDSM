"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdvertiserNameDialog } from "./components/advertiser-name-dialog/advertiser-name-dialog"
import { PhoneDialog } from "./components/phone-dialog/phone-dialog"
import { NameDialog } from "./components/name-dialog/name-dialog"
import { PasswordDialog } from "./components/password-dialog/password-dialog"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { EmailDialog } from "./components/email-dialog/email-dialog"
import { Loader2 } from "lucide-react"
import { useUser as useUserContext } from "../context/user-content"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { userService } from "@/services/user"

const Settings = () => {
  const { user, setUser } = useUserContext()
  const { toast } = useToast()
  useEffect(() => {
    const getUserById = async () => {
      try {
        const user = await userService.getUserById()
        setUser(user)
      } catch (error) {
        toast({
          title: "Erro interno",
          description: "Ocorreu um erro interno ao processar a sua requisição, por favor tente novamente mais tarde."
        })
      }
    }

    getUserById()
  }, [])

  if (!user) return <Loader2 className="animate-spin h-6 w-6" />

  return (
    <div className="container max-w-6xl py-10 mx-auto">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências de conta.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais. Estas informações serão exibidas publicamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Nome</h3>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
              <NameDialog />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Nome de Anunciante</h3>
                <p className="text-sm text-muted-foreground">{user.advertiserName}</p>
              </div>
              <AdvertiserNameDialog />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Telefone</h3>
                <p className="text-sm text-muted-foreground">{user.phone ?? ""}</p>
              </div>
              <PhoneDialog />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança da Conta</CardTitle>
            <CardDescription>Atualize suas credenciais de segurança para proteger sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">pão</p>
              </div>
              <EmailDialog />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Senha</h3>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <PasswordDialog />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings