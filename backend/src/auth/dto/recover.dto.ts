import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { RecoverTypeEnum } from "src/recover/enum/recover-type.enum";

export class RecoverDto {
  @IsNotEmpty({ message: "The email is required" })
  @IsEmail({}, { message: "The email must be a valid email" })
  email: string

  @IsNotEmpty({ message: "The type is required" })
  @IsEnum(RecoverTypeEnum, { message: "The type must be PASSWORD OR EMAIL" })
  type: RecoverTypeEnum
}