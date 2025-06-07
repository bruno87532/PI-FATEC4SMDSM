"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Loader2 } from "lucide-react"
import { useUser as useUserContext } from "@/app/context/user-context"
import { useEffect, useState, useCallback } from "react"
import { userService } from "@/services/user"
import { StepProvider } from "@/components/utils/email-dialog/components/context/step-context"
import { NumberDialog } from "@/components/utils/number-dialog/number-dialog"
import { ZipCodeDialog } from "@/components/utils/zip-code-dialog/zip-code-dialog"
import { NameDialog } from "@/components/utils/name-dialog/name-dialog"
import { PasswordDialog } from "@/components/utils/password-dialog/password-dialog"
import { EmailDialog } from "@/components/utils/email-dialog/email-dialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StepOne as PhoneStepOne } from "@/components/utils/phone-dialog/components/step-one/step-one"
import { StepTwo as PhoneStepTwo } from "@/components/utils/phone-dialog/components/step-two/step-two"

const PhoneDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>("")
  const [step, setStep] = useState<number>(0)

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setStep(0)
      setPhone("")
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      {step === 0 ? (
        <PhoneStepOne setStep={setStep} setPhone={setPhone} />
      ) : (
        <PhoneStepTwo setIsOpen={setIsOpen} phone={phone} setStep={setStep} />
      )}
    </Dialog>
  )
}

const Settings = () => {
  const { user, setUser } = useUserContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUserById = async () => {
      try {
        setIsLoading(true)
        const userData = await userService.getUserById()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUserById()
  }, [setUser])

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  return (
    <StepProvider>
      <div className="container max-w-6xl py-10 mx-auto">
        <div className="flex flex-col gap-8">
          <div className="space-y-1 px-6">
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências de conta.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
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
                  <h3 className="text-sm font-medium">Telefone</h3>
                  <p className="text-sm text-muted-foreground">{user.phone ?? ""}</p>
                </div>
                <PhoneDialog />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">CEP</h3>
                  <p className="text-sm text-muted-foreground">{user.zipCode ?? ""}</p>
                </div>
                <ZipCodeDialog />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Estado</h3>
                  <p className="text-sm text-muted-foreground">{user.state ?? ""}</p>
                </div>
                <ZipCodeDialog
                  dataValue={{
                    value: "estado",
                    message: "Ao atualizá-lo, o estado será atualizado automaticamente",
                    titleToast: "Estado alterado",
                    descriptionToast: "Estado alterado com sucesso",
                  }}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Cidade</h3>
                  <p className="text-sm text-muted-foreground">{user.city ?? ""}</p>
                </div>
                <ZipCodeDialog
                  dataValue={{
                    value: "cidade",
                    message: "Ao atualizá-lo, a cidade será atualizada automaticamente",
                    titleToast: "Cidade alterada",
                    descriptionToast: "Cidade alterada com sucesso",
                  }}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Bairro</h3>
                  <p className="text-sm text-muted-foreground">{user.neighborhood ?? ""}</p>
                </div>
                <ZipCodeDialog
                  dataValue={{
                    value: "bairro",
                    message: "Ao atualizá-lo, o bairro será atualizado automaticamente",
                    titleToast: "Bairro alterado",
                    descriptionToast: "Bairro alterado com sucesso",
                  }}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Rua</h3>
                  <p className="text-sm text-muted-foreground">{user.road ?? ""}</p>
                </div>
                <ZipCodeDialog
                  dataValue={{
                    value: "rua",
                    message: "Ao atualizá-lo, a rua será atualizada automaticamente",
                    titleToast: "Rua alterada",
                    descriptionToast: "Rua alterada com sucesso",
                  }}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Número</h3>
                  <p className="text-sm text-muted-foreground">{user.marketNumber ?? ""}</p>
                </div>
                <NumberDialog />
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
                  <p className="text-sm text-muted-foreground">{user.email}</p>
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
    </StepProvider>
  )
}

export default Settings
