import { Exclude, Expose, Transform } from "class-transformer";

export class UserResponseDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  advertiserName: string | null

  @Expose()
  @Transform(({ value }) => {
    if (!value || typeof value !== "string") return value
    const [name, domain] = value.split("@")
    if (!name || !domain) return value
    if (name.length <= 4) {
      return `${name.replace(/./g, "*")}@${domain}`
    }

    const start = name.slice(0, 2);
    const middle = name.slice(2, -2).replace(/./g, "*")
    const end = name.slice(-2)

    return `${start}${middle}${end}@${domain}`
  })
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

  @Expose()
  typeUser: string

  @Exclude()
  randomCode: string

  @Exclude()
  isActivate: Date

  @Exclude()
  randomCodeExpiration: Date

  @Exclude()
  randomCodePhone: String

  @Exclude()
  rancomCodePhoneExpiration: Date
}