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
    const user = req.user
    return await this.stripeService.createCheckout(data.price, user)
  }

  @Post("/payment-successfully") 
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async paymentSucessfully(
    @Request() req,
    @Headers("stripe-signature") signature: string,
    @Body() data: Buffer
  ) {
    return await this.stripeService.paymentSucessfully(data, signature, req.user.id)
  }
}
