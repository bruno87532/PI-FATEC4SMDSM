import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyRecoverDto {
  @IsNotEmpty({ message: "The randomCode is required" })
  @IsString({ message: "The randomCode must be a string" })
  @Length(6, 6, { message: "The randomCode must be 6 characters long" })
  randomCode: string

  @IsNotEmpty({ message: "The idUser is required" })
  @IsString({ message: "The idUser must be a string" })
  idUser: string
}
