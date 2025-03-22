import { Controller } from '@nestjs/common';
import { Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @Post("/create-checkout")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createCheckout(@Body() data: CreateCheckoutDto) {
        return await this.stripeService.createCheckout(data)
    }
}
