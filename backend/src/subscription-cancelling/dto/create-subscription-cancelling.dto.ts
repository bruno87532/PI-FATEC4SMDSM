import { IsIn } from "class-validator";

export class createSubscriptionCancellingDto {
  @IsIn(["Muito caro", "Não estou usando", "Falta de recursos", "Encontrei outra alternativa"])
  reason: string
}