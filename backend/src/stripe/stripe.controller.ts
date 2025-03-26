import { Controller, Get, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("/create-checkout")
  async createCheckout() {
    return await this.stripeService.createCheckout()
  }
}
