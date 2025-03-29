import { Controller, Post, Headers, Body, UsePipes, ValidationPipe } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { CreateCheckoutDto } from './dto/create-checkout.dto'

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("/create-checkout")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createCheckout(@Body() data: CreateCheckoutDto) {
    return await this.stripeService.createCheckout(data.price)
  }

  @Post("/payment-successfully") 
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async paymentSucessfully(
    @Headers("stripe-signature") signature: string,
    @Body() data: Buffer
  ) {
    const dataToString = data.toString()
    return await this.stripeService.paymentSucessfully(dataToString, signature)
  }
}
