import { Exclude, Expose } from "class-transformer";

export class UserResponseDto {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    advertiserName: string | null

    @Expose()
    email: string 

    @Expose()
    phone: string | null

    @Expose()
    zipCode: string | null

    @Expose()
    state: string | null

    @Expose()
    city: string | null

    @Expose()
    neighborhood: string | null

    @Expose()
    road: string | null

    @Expose()
    marketNumber: string | null

    @Exclude()
    password: string

    @Exclude()
    typeUser: string

    @Exclude()
    randomCode: string

    @Exclude()
    isActivate: Date

    @Exclude()
    randomCodeExpiration: Date
}