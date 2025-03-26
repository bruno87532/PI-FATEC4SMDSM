import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject("STRIPE_CLIENT") private readonly stripe: Stripe) { }

  async createCheckout() {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: "price_1R3GhLACW4sHRd3kW1kehkZX",
            quantity: 1
          }
        ],
        ui_mode: "embedded",
        return_url: "http://localhost:3000?payment-confirmation?session_id={CHECKOUT_SESSION_ID}"
      })
      return session
    } catch (error) {
      console.error("An error ocurred while creating checkout stripe", error)
      throw new InternalServerErrorException("An error ocurred while creating checkout stripe", error)
    }
  }
}
