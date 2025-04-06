import { Controller, Post, Headers, Body, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { CreateCheckoutDto } from './dto/create-checkout.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  
  @UseGuards(AuthGuard("jwt"))
  @Post("/create-checkout")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createCheckout(@Body() data: CreateCheckoutDto, @Request() req) {
    return await this.stripeService.createCheckout(data.price, req.user.userId)
  }

  @Post("/payment-successfully") 
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async paymentSucessfully(
    @Headers("stripe-signature") signature: string,
    @Body() data: Buffer
  ) {
    return await this.stripeService.paymentSucessfully(data, signature)
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("/cancel-subscription")
  async cancelSubscription(@Request() req) {
    return await this.stripeService.cancelSubscription(req.user.userId)
  }
}
