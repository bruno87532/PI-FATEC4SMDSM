import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class AddProductDto {
  @IsString({ message: "The id must be a string" })
  @IsNotEmpty({ message: "The id is required" })
  @MinLength(1, { message: "The id must be a 1 character long" })
  id: string
}