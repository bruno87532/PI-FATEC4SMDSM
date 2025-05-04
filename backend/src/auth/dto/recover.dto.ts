import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export class RecoverDto {
  @IsNotEmpty({ message: "The email is required" })
  @IsEmail({}, { message: "The email must be a valid email" })
  email: string
}