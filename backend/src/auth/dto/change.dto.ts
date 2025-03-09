import { IsString, Matches, IsNotEmpty, MinLength, IsEmail, IsOptional, IsEnum } from "class-validator";
import { RecoverTypeEnum } from "src/recover/enum/recover-type.enum";

export class ChangeDto {
  @IsOptional()
  @IsString({ message: "The password must be a string" })
  @MinLength(8, { message: "The password must be at least 8 characters long" })
  @Matches(/(?=.*[a-z])/, { message: "The password must have at least 1 lowercase character" })
  @Matches(/(?=.*[A-Z])/, { message: "The password must have at least 1 uppercase character" })
  @Matches(/(?=.*\W)/, { message: "Password must have at lest 1 special character" })
  @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
  password: string

  @IsOptional()
  @IsEmail({}, { message: "The email must be a valid email" })
  email: string

  @IsNotEmpty({ message: "The type is required" }) 
  @IsEnum(RecoverTypeEnum, { message: "The type must be PASSWORD or EMAIL" })
  type: RecoverTypeEnum

  @IsString({ message: "The idUser must be a string" })
  @IsNotEmpty({ message: "The idUser is required" })
  idUser: string
}
