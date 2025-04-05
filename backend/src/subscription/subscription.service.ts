import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) { }

  async createSubscription(data: { idPlan: string, idUser: string, expirationDate: Date }) {
    const { idPlan, idUser, expirationDate } = data
    try {
      const subscription = await this.prismaService.subscription.create({
        data: {
          idUser,
          idPlan,
          expirationDate,
          isActivate: true
        }
      })
    } catch (error) {
      console.error("An error ocurred while creating subscription", error)
      throw new InternalServerErrorException("An error ocurred while creating subscription")
    }
  }
}
