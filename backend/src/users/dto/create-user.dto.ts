import { IsEmail, IsNotEmpty, Length, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "The email must be a valid email" })
    @IsNotEmpty({ message: "The email is required" })
    email: string

    @IsNotEmpty({ message: "The name is required" })
    @IsString({ message: "The name must be a string" })
    @Length(1, 200, { message: "The name must be between 1 and 200 characters long" })
    name: string
}