import { IsString, Matches, MinLength, IsOptional, Length, IsEmail } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @MinLength(8, { message: "The password must be at least 8 characters long" })
    @IsString({ message: "The password must be a string" })
    @Matches(/(?=.*[a-z])/, { message: "Password must have at lest 1 lowercase character" })
    @Matches(/(?=.*[A-Z])/, { message: "Password must have at lest 1 uppercase character" })
    @Matches(/(?=.*\W)/, { message: "Password must have at lest 1 special character" })
    @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
    password: string

    @IsOptional()
    @Length(11, 11, { message: "The phone number must be 11 characters long" })
    @IsString({ message: "The phone must be a string" })
    @Matches(/^\d{2}9\d{8}$/, { message: "The phone number must be valid" })
    phone: string

    @IsOptional()
    @IsString({ message: "The name must be a string" })
    @MinLength(1, { message: "The name must be at least 1 character long" })
    name: string

    @IsOptional()
    @IsString({ message: "The name must be a string" })
    @MinLength(1, { message: "The name must be at least 1 character long" })
    advertiserName: string

    @IsOptional()
    @IsEmail({}, { message: "The email must be an email" })
    email: string
}
