import { Exclude, Expose } from "class-transformer";

export class ItemResponseDto {
  @Expose()
  id: string

  @Expose()
  idProduct: string

  @Expose()
  quantity: number

  @Expose()
  unitPrice: number

  @Exclude()
  idCart: string

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date
}