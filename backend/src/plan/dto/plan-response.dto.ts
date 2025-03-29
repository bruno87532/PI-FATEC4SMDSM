import { Prisma } from '@prisma/client';
import { Expose, Exclude } from 'class-transformer';

export class PlanResponseDto {
  @Expose()
  name: string;

  @Expose()
  idPrice: string;

  @Exclude()
  id: string;

  @Exclude()
  subscriptions: Record<string, string>;  
}
