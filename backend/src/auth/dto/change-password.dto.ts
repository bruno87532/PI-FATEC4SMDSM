import { IsString, Matches, IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString({ message: "The password must be a string" })
  @IsNotEmpty({ message: "The password is required" })
  @MinLength(8, { message: "The password must be at least 8 characters long" })
  @Matches(/(?=.*[a-z])/, { message: "The password must have at least 1 lowercase character" })
  @Matches(/(?=.*[A-Z])/, { message: "The password must have at least 1 uppercase character" })
  @Matches(/(?=.*\W)/, { message: "Password must have at lest 1 special character" })
  @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
  password: string

  @IsString({ message: "The id must be a string" })
  @IsNotEmpty({ message: "The id is required" })
  id: string
}
