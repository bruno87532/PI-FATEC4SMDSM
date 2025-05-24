import { IsNotEmpty, IsString, IsInt, Min } from "class-validator";

export class CreatePurchaseDto {
  @IsInt({ message: "The promotional price must be an integer" })
  @Min(1, { message: "The promotional price must be at least 1" })
  totalPrice: number

  @IsNotEmpty({ message: "The idUserAdvertiser is required" })
  @IsString({ message: "The idUserAdvertiser must be a string" })
  idUserAdvertiser: string
}