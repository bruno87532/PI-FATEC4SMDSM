import { IsArray, ArrayMinSize, IsString } from "class-validator"

export class GetAllItensByIdCartsDto {
  @IsArray({ message: "The idCarts must be an array" })
  @ArrayMinSize(1, { message: "The idCarts array must have at least 1 element" })
  @IsString({ each: true, message: "Each idCart must be a string" })
  idCarts: string[]
}