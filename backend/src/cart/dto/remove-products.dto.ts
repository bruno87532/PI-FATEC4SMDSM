import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class RemoveProductsDto {
  @IsArray({ message: "The ids must be a array" })
  @ArrayMinSize(1, { message: "The array must have at least 1 element" })
  @IsString({ each: true, message: "Each id must be a string" })
  ids: string[]
}