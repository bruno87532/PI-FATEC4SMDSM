import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService) {}
  
  async getPlan() {
    return await this.prismaService.plan.findMany()
  }
}
