import { Exclude, Expose } from "class-transformer";

export class UserResponseDto {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    email: string 

    @Expose()
    phone: string | null

    @Exclude()
    password: string

    @Exclude()
    randomCode: string

    @Exclude()
    isActivate: Date

    @Exclude()
    randomCodeExpiration: Date
}