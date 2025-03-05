import * as bcrypt from 'bcryptjs';
import { IsString, Matches, MinLength, IsOptional } from "class-validator";
import { Transform } from "class-transformer"

export class UpdateUserDto {
    @IsOptional()
    @MinLength(8, { message: "The password must be at least 8 characters long" })
    @IsString({ message: "The password must be a string" })
    @Matches(/(?=.*[a-z])/, { message: "Password must have at lest 1 lowercase character" })
    @Matches(/(?=.*[A-Z])/, { message: "Password must have at lest 1 uppercase character" })
    @Matches(/(?=.*\W)/, { message: "Password must have at lest 1 special character" })
    @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
    @Transform(({ value }) => bcrypt.hashSync(value, 10))
    password: string
}