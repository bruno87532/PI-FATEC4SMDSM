import { NotFoundException, Injectable, HttpException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Plan } from '@prisma/client';

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService) {}
  
  async getPlan(): Promise<Plan[] | null> {
    return await this.prismaService.plan.findMany()
  }

  async getPlanByIdPrice(idPrice: string): Promise<Plan> {
    try {
      const plan = await this.prismaService.plan.findUnique({ where: { idPrice } })
    
      if (!plan) {
        throw new NotFoundException("Plan not found")
      }

      return plan
    } catch (error) {
      console.error("An error ocurred while fetching plan", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching plan")
    }
  }
}
