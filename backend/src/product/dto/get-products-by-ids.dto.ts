import { IsArray, IsString, IsNotEmpty } from "class-validator";

export class GetProductsByIdsDto {
  @IsArray({ message: "The ids must be an array" })
  @IsString({ each: true, message: "Each id must be a string" })
  @IsNotEmpty({ each: true, message: "Each id is required" })
  ids: string[]
}