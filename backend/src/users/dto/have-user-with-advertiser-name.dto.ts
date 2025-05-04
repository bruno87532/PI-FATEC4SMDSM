import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class HaveUserWithAdvertiserNameDto {
  @IsNotEmpty({ message: "The advertiserName is required" })
  @IsString({ message: "The advertiserName must be a string" })
  @MinLength(1, { message: "The advertiserName must be at least 1 character long" })
  advertiserName: string
}