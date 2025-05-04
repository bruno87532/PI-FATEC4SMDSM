import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyRecoverEmailDto {
  @IsNotEmpty({ message: "The randomCode is required" })
  @IsString({ message: "The randomCode must be a string" })
  @Length(6, 6, { message: "The randomCode must be 6 characters long" })
  randomCode: string
}