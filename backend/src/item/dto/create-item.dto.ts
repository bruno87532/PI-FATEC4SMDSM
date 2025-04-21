import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateItemDto {
  @IsString({ message: "The idProduct must be a string" })
  @IsNotEmpty({ message: "The idProduct is required" })
  @MinLength(1, { message: "The idProduct must be a 1 character long" })
  idProduct: string
}