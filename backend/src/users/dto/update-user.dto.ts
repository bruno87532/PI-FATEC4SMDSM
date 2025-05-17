import { IsString, Matches, MinLength, IsOptional, Length, IsEmail, MaxLength, IsIn } from "class-validator";

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
  @MinLength(10, { message: "The phone number must be at least 10 characters long" })
  @MaxLength(11, { message: "The phone number must be a maxium of 11 characters long" })
  @IsString({ message: "The phone must be a string" })
  @Matches(/^\d{2}9\d{7,8}$/, { message: "The phone number must be valid" })
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

  @IsOptional()
  @IsString({ message: "The zipCode must be a string" })
  @Length(8, 8, { message: "The zipCode must be 8 characters long" })
  zipCode: string

  @IsOptional()
  @IsIn(["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"], {
    message: "The state must be valid"
  })
  state: string

  @IsOptional()
  @IsString({ message: "The city must be a string" })
  @MinLength(1, { message: "The city must be at least 1 character long" })
  city: string

  @IsOptional()
  @IsString({ message: "The neighborhood must be a string" })
  @MinLength(1, { message: "The neighborhood must be at least 1 character long" })
  neighborhood: string

  @IsOptional()
  @IsString({ message: "The road must be a string" })
  @MinLength(1, { message: "The road must be at least 1 character long" })
  road: string

  @IsOptional()
  @IsString({ message: "The marketNumber must be a string" })
  @MinLength(1, { message: "The marketNumber must be at least 1 character long" })
  marketNumber: string
}
