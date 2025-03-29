import { IsNotEmpty, IsString } from "class-validator";

export class CreateCheckoutDto {
  @IsNotEmpty({ message: "The price is required" })
  @IsString({ message: "The price must be a string" })
  price: string
}