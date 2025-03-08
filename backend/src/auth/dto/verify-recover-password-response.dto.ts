import { Expose, Exclude } from "class-transformer";

export class VerifyRecoverPasswordResponseDto {
  @Expose()
  id: string

  @Expose()
  userId: string

  @Exclude()
  randomCode: string
}