import { Request, UseGuards, Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getSubscriptionActiveByIdUser(@Request() req) {
    return await this.subscriptionService.getSubscriptionActiveByIdUser(req.user.userId)
  }
}
