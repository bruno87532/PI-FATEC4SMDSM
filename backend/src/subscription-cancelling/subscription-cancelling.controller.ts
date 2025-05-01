import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body, Request } from '@nestjs/common';
import { SubscriptionCancellingService } from './subscription-cancelling.service';
import { AuthGuard } from '@nestjs/passport';
import { createSubscriptionCancellingDto } from './dto/create-subscription-cancelling.dto';

@Controller('subscription-cancelling')
export class SubscriptionCancellingController {
  constructor(private readonly subscriptionCancellingService: SubscriptionCancellingService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseGuards(AuthGuard("jwt"))
  async createSubscriptionCancelling(@Body() data: createSubscriptionCancellingDto, @Request() req) {
    return await this.subscriptionCancellingService.createSubscriptionCancelling(data, req.user.userId)
  }
}
