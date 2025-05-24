import { IsString, IsNotEmpty } from "class-validator"

export class FeaturedProductByPartialNameDto {
  @IsString({ message: "The partialName must be a string" })
  @IsNotEmpty({ message: "The partialName is required" })
  partialName: string
}