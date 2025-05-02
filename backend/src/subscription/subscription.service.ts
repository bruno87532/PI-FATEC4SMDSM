import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Subscription } from '@prisma/client';
import { updateSubscription } from './interfaces/update-subscription.interface';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) { }

  async createSubscription(data: { idPlan: string, idUser: string, idStripe: string, expirationDate: Date }): Promise<Subscription> {
    const { idPlan, idUser, expirationDate, idStripe } = data
    try {
      const subscription = await this.prismaService.subscription.create({
        data: {
          idUser,
          idPlan,
          expirationDate,
          idStripe,
          isActivate: true,
        }
      })

      return subscription
    } catch (error) {
      console.error("An error ocurred while creating subscription", error)
      throw new InternalServerErrorException("An error ocurred while creating subscription")
    }
  }

  async getSubscriptionActiveByIdUser(idUser: string) {
    try {
      const subscription = await this.prismaService.subscription.findFirst({
        where: {
          idUser, 
          isActivate: true
        }
      })

      if (!subscription) throw new NotFoundException("Subscription not found")

      return subscription
    } catch (error) {
      console.error("An error ocurred while fetching subscription", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching subscription")
    }
  }

  async getSubscriptionByIdStripe(idStripe: string): Promise<Subscription> {
    try {
      const subscription = await this.prismaService.subscription.findUnique({ where: { idStripe } })
      if (!subscription) throw new NotFoundException("Subscription not found")
      return subscription
    } catch (error) {
      console.error("An error ocurred while fetching subscription", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching subscription")
    }
  }

  async updateSubscription(id: string, data: updateSubscription): Promise<Subscription> {
    try {
      const subscription = await this.prismaService.subscription.update({
        where: { id },
        data
      })

      return subscription
    } catch (error) {
      console.error("An error ocurred while updating subscription", error)
      throw new InternalServerErrorException("An error ocurred while updating subscription")
    }
  } 

  async getSubscriptionsByIdUser(idUser): Promise<Subscription[]> {
    try {
      const subscriptions = await this.prismaService.subscription.findMany({
        where: { idUser }
      })
      if (!subscriptions) throw new NotFoundException("Subscriptions not found")

      return subscriptions
    } catch (error) {
      console.error("An error ocurred while fetching subscription", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching subscription")
    }
  }

  async getSubscriptionsActivateByIdPlan(idPlan: string): Promise<Subscription[]> {
    try {
      const subscriptions = await this.prismaService.subscription.findMany({ where: { idPlan } })
      const subscriptionsActivate = subscriptions.filter((subscription) => subscription.isActivate === true) 
      if (!subscriptionsActivate) throw new NotFoundException("Subscriptions not found")

      return subscriptionsActivate
    } catch (error) {
      console.error("Ocurred an error while fetching all subscriptions", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("Ocurred an error while fetching all subscriptions")
    }
  }
}
