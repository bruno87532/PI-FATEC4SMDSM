import { IsString, Matches, Length, MinLength, IsNotEmpty } from "class-validator";

export class NewPasswordDto {
  @IsNotEmpty({ message: "The password is required" })
  @MinLength(8, { message: "The password must be at least 8 characters long" })
  @IsString({ message: "The password must be a string" })
  @Matches(/(?=.*[a-z])/, { message: "Password must have at least 1 lowercase character" })
  @Matches(/(?=.*[A-Z])/, { message: "Password must have at least 1 uppercase character" })
  @Matches(/(?=.*\W)/, { message: "Password must have at least 1 special character" })
  @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
  password: string

  @IsNotEmpty({ message: "The randomCode is required" })
  @Length(6, 6, { message: "The randomCode must be 6 characters long" })
  @IsString({ message: "The randomCode must be a string" })
  randomCode: string

  @IsString({ message: "The idUser must be a string" })
  @IsNotEmpty({ message: "The idUser is required" })
  idUser: string
}