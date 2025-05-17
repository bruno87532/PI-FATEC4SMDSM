import { Expose, Exclude } from "class-transformer";

export class CartResponseDto {
  @Expose()
  id: string

  @Expose()
  totalPrice: number

  @Exclude()
  idUser: string

  @Exclude()
  idAdvertiser: string
}