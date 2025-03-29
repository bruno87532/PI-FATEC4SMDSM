import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PlanService],
  controllers: [PlanController],
  imports: [PrismaModule],
  exports: [PlanService]
})
export class PlanModule {}
