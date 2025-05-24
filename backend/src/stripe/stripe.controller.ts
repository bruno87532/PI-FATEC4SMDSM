import { Controller, Post, Headers, Body, UsePipes, ValidationPipe, UseGuards, Request, Patch } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { CreateCheckoutDto } from './dto/create-checkout.dto'
import { AuthGuard } from '@nestjs/passport'
import { CreatePurchaseDto } from './dto/create-purchase.dto'

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("/create-checkout")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createCheckout(@Body() data: CreateCheckoutDto, @Request() req) {
    return await this.stripeService.createCheckout(data.price, req.user.userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("/create-purchase")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createPurchase(@Body() data: CreatePurchaseDto, @Request() req) {
    return await this.stripeService.createPurchase(data, req.user.userId)
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
  @Patch("/cancel-subscription")
  async cancelSubscription(@Request() req) {
    return await this.stripeService.cancelSubscription(req.user.userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("/reactivate-subscription")
  async reactivateSubscription(@Request() req) {
    return await this.stripeService.reactivateSubscription(req.user.userId)
  }
}
