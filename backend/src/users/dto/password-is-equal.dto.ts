import { IsString, MinLength, IsNotEmpty } from "class-validator";

export class PasswordIsEqualDto {
  @IsNotEmpty({ message: "The password is required" })
  @IsString({ message: "The password must be a string" })
  @MinLength(1, { message: "The password must be 1 character long" })
  password: string
}