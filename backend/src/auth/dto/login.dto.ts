import { IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "The email is required" })
  email: string

  @IsNotEmpty({ message: "The password is required" })
  password: string
}