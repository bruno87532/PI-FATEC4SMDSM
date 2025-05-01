import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createSubscriptionCancellingDto } from './dto/create-subscription-cancelling.dto';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class SubscriptionCancellingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) { }

  private async getSubscriptionCancellingByIdSubscription(idSubscription: string) {
    try {
      const subscriptionCancelling = await this.prismaService.subscriptionCancelling.findMany({ where: { idSubscription } })
      if (subscriptionCancelling.length === 0) throw new NotFoundException("subscription cancelling not found")

      return subscriptionCancelling
    } catch (error) {
      console.error("An error ocurred while fetching subscription cancelling")
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching subscription cancelling")
    }
  }

  async createSubscriptionCancelling(data: createSubscriptionCancellingDto, idUser: string) {
    try {
      const subscriptions = await this.subscriptionService.getSubscriptionsByIdUser(idUser)
      const subscription = subscriptions.find((subscription) => subscription.isActivate = true)
      if (!subscription) throw new NotFoundException("Active subscription not found")

      try {
        const subscriptionCancellingAlreadyExists = await this.getSubscriptionCancellingByIdSubscription(subscription.id)
        const now = new Date()
        subscriptionCancellingAlreadyExists.forEach((subscriptionCancelling) => {
          if (now.getTime() - new Date(subscriptionCancelling.createdAt).getTime() < 24 * 60 * 60 * 1000) {
            throw new BadRequestException("Daily creation limit exceeded")
          }
        })
      } catch (error) {
        if (error instanceof BadRequestException) throw error
      }

      const subscriptionCancelling = await this.prismaService.subscriptionCancelling.create({
        data: {
          idSubscription: subscription.id,
          reason: data.reason
        }
      })

      return subscriptionCancelling
    } catch (error) {
      console.error("An error ocurred while creating subscription cancelling", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while creating subscription cancelling")
    }
  }
}
