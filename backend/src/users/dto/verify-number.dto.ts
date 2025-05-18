import { MinLength, MaxLength, IsString, Matches, Length } from "class-validator"

export class VerifyNumberDto {
  @MinLength(10, { message: "The phone number must be at least 10 characters long" })
  @MaxLength(11, { message: "The phone number must be a maxium of 11 characters long" })
  @IsString({ message: "The phone must be a string" })
  @Matches(/^\d{2}9\d{7,8}$/, { message: "The phone number must be valid" })
  phone: string

  @Length(6, 6, { message: "The randomCode must be 6 characters long" })
  @IsString({ message: "The randomCode must be a string" })
  randomCode: string
}