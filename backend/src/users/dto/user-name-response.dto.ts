import { Expose } from "class-transformer"

export class UserNameResponseDto{
  @Expose()
  id: string

  @Expose()
  advertiserName: string
}