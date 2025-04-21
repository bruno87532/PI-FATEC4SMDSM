import { z } from "zod"

const baseSchema = {
  name: z.string()
    .min(2, { message: "O nome do produto deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O nome do produto deve ter no máximo 100 caracteres" }),

  description: z.string()
    .optional()
    .refine((value) => !value || value.length >= 2, {
      message: "A descrição deve ter pelo menos 2 caracteres"
    })
    .refine((value) => !value || value.length <= 256, {
      message: "A descrição deve ter no máximo 256 caracteres"
    }),

  regularPrice: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "O preço deve ser um número positivo"
    }),

  promotionalPrice: z.string().optional(),

  promotionExpiration: z.date().optional(),

  promotionStart: z.date().optional(),

  subCategorys: z.array(z.string())
    .min(1, { message: "Pelo menos uma subcategoria deve ser selecionada" })
    .max(5, { message: "No máximo 5 subcategorias podem ser selecionadas" }),

  categorys: z.array(z.string())
    .min(1, { message: "Pelo menos uma categoria deve ser selecionada" })
    .max(5, { message: "No máximo 5 categorias podem ser selecionadas" }),

  stock: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "O estoque deve ser um número positivo"
    }),

  file: z
    .instanceof(File, { message: "A imagem não pode estar vazia" })
    .refine((file) => file.type.startsWith('image/'), { message: 'O arquivo deve ser uma imagem.' })
}

const baseZodSchema = z.object(baseSchema)
export type Product = z.infer<typeof baseZodSchema>

export const createSchema = (isPromotional: boolean) =>
  z.object({
    ...baseSchema,
    promotionalPrice: baseSchema.promotionalPrice.refine((val) => {
      if (isPromotional && val === "00.00") return false
      return true
    }, { message: "O preço promocional é obrigatório" }),

    promotionStart: baseSchema.promotionStart.refine((val) => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      if (isPromotional && val && val.getTime() < now.getTime()) return false
      return true
    }, { message: "A data de início deve ser futura" }),

    promotionExpiration: baseSchema.promotionExpiration.refine((val) => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      if (isPromotional && val && now.getTime() < now.getTime()) return false
      return true
    }, { message: "A data de expiração deve ser futura" }),
  })
