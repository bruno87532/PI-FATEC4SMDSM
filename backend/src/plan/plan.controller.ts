import { Controller, Get } from '@nestjs/common';
import { PlanService } from './plan.service';
import { plainToInstance } from 'class-transformer';
import { PlanResponseDto } from './dto/plan-response.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async getPlan() {
    return plainToInstance(PlanResponseDto, await this.planService.getPlan())
  }
}
