import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { viacep } from "@/services/viacep";
import { userService } from "@/services/user";
import { maskPhone } from "@/utils/mask-phone";
import { useUser } from "@/app/context/user-context";

export const UseUserPayment = (
  setIsLoadingButton: React.Dispatch<React.SetStateAction<boolean>>,
  setPhone: React.Dispatch<React.SetStateAction<string>>,
  setStep: React.Dispatch<React.SetStateAction<number>>
) => {
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser } = useUser()

  const FormSchema = z.object({
    zipCode: z.string().length(8, { message: "O CEP deve ter oito caracteres" }),
    state: z.string().min(1, { message: "O estado é obrigatório" }),
    city: z.string().min(1, "A cidade é obrigatória"),
    neighborhood: z.string().min(1, { message: "O bairro é obrigatório" }),
    road: z.string().min(1, { message: "A rua é obrigatória" }),
    marketNumber: z.string().min(1, { message: "O número é obrigatório" }),
    phone: z
      .preprocess((val) => {
        if (typeof val === "string") {
          return val.replace(/\D/g, "");
        }
        return val
      },
        z.string()
          .min(10, { message: "O número de telefone deve ter pelo menos 10 caracteres" })
          .regex(/^\d{2}9\d{7,8}/, { message: "O número de telefone deve ser válido" }),
      )
  })

  type FormSchemaType = z.infer<typeof FormSchema>
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      zipCode: user?.zipCode ?? "",
      state: user?.state ?? "",
      city: user?.city ?? "",
      neighborhood: user?.neighborhood ?? "",
      road: user?.road ?? "",
      marketNumber: user?.marketNumber ?? "",
      phone: user?.phone ? maskPhone(user.phone) : "",
    },
  })

  const handleChangeCep = async (cep: string) => {
    if (cep.length !== 8) {
      form.setError("zipCode", {
        type: "manual",
        message: "Informe um cep válido"
      })
    } else {
      form.clearErrors("zipCode")
      const data = await viacep.getDataCep(cep)
      if (data?.erro && !!data.erro === true) {
        form.setError("zipCode", {
          type: "manual",
          message: "Informe um cep válido"
        })
      } else {
        form.setValue("road", data.logradouro)
        form.setValue("state", data.uf)
        form.setValue("neighborhood", data.bairro),
          form.setValue("city", data.localidade)
      }
    }
  }

  const handleSubmit = async (data: FormSchemaType) => {
    setIsLoading(true)
    setIsLoadingButton(true)
    const { phone, ...newData } = data
    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        ...data
      }
    })
    await userService.confirmationNumber(phone)
    await userService.updateUser(newData)
    setPhone(phone)
    setStep(1)
    setIsLoading(false)
    setIsLoadingButton(false)
  }

  const states = {
    Acre: "AC",
    Alagoas: "AL",
    Amapá: "AP",
    Amazonas: "AM",
    Bahia: "BA",
    Ceará: "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    Goiás: "GO",
    Maranhão: "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    Pará: "PA",
    Paraíba: "PB",
    Paraná: "PR",
    Pernambuco: "PE",
    Piauí: "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    Rondônia: "RO",
    Roraima: "RR",
    "Santa Catarina": "SC",
    "São Paulo": "SP",
    Sergipe: "SE",
    Tocantins: "TO",
  }

  return { isLoading, states, handleSubmit, handleChangeCep, form }
}