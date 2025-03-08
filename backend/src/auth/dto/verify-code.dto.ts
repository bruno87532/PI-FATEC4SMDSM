import { IsNotEmpty, Length, IsString } from "class-validator";

export class VerifyCodeDto {
    @IsString({ message: "The random code must be a string" })
    @IsNotEmpty({ message: "The randomCode is required" })
    @Length(6, 6, { message: "The randomCode must be 6 characters long" })
    randomCode: string

    @IsString({ message: "The id must be a string" })
    @IsNotEmpty({ message: "The id is required" })
    id: string
}