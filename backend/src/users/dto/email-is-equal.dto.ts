import { IsEmail, IsNotEmpty } from "class-validator"

export class EmailIsEqualDto {
  @IsEmail({}, { message: "The email must be a valid email" })
  @IsNotEmpty({ message: "The email is required" })
  email: string
}