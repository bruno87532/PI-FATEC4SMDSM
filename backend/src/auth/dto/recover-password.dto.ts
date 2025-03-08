import { IsEmail, IsNotEmpty } from "class-validator";

export class RecoverPasswordDto {
  @IsNotEmpty({ message: "The email is required" })
  @IsEmail({}, { message: "The email must be a valid email" })
  email: string
}