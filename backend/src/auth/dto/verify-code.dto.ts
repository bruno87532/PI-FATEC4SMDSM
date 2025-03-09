import { IsNotEmpty, Length, IsString } from "class-validator";

export class VerifyCodeDto {
    @IsString({ message: "The random code must be a string" })
    @IsNotEmpty({ message: "The randomCode is required" })
    @Length(6, 6, { message: "The randomCode must be 6 characters long" })
    randomCode: string

    @IsString({ message: "The idUser must be a string" })
    @IsNotEmpty({ message: "The idUser is required" })
    idUser: string
}