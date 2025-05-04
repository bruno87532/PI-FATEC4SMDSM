import { IsNotEmpty, MinLength, Matches, IsString } from "class-validator"

export class AlterPasswordDto {
  @IsNotEmpty({ message: "The password is required" })
  @IsString({ message: "The password must be a string" })
  oldPassword: string

  @IsNotEmpty({ message: "The password is required" })
  @MinLength(8, { message: "The password must be at least 8 characters long" })
  @IsString({ message: "The password must be a string" })
  @Matches(/(?=.*[a-z])/, { message: "Password must have at least 1 lowercase character" })
  @Matches(/(?=.*[A-Z])/, { message: "Password must have at least 1 uppercase character" })
  @Matches(/(?=.*\W)/, { message: "Password must have at least 1 special character" })
  @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
  newPassword: string
}