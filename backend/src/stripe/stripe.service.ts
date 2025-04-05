import { Injectable, Inject, InternalServerErrorException, RawBody } from '@nestjs/common';
import Stripe from 'stripe';
import { User } from 'src/auth/interfaces/user.interface';

@Injectable()
export class StripeService {
  constructor(
    @Inject("STRIPE_CLIENT") private readonly stripe: Stripe,
  ) { }

  // ---- Início da lógica de criação de checkout ---- //

  async createCheckout(price: string, user: User) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price,
            quantity: 1
          }
        ],
        ui_mode: "embedded",
        return_url: "http://localhost:3000?payment-confirmation?session_id={CHECKOUT_SESSION_ID}"
      })
      return session
    } catch (error) {
      console.error("An error ocurred while creating checkout stripe", error)
      throw new InternalServerErrorException("An error ocurred while creating checkout stripe")
    }
  }

  // ---- Fim da lógica de criação de checkout ---- //
  // ---- Início da lógica de processar pagamento ---- //

  async paymentSucessfully(data: Buffer, signature: string, id: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ""
    const dataToString = data.toString()

    try {
      const event = this.stripe.webhooks.constructEvent(
        dataToString,
        signature, 
        endpointSecret
      )
      console.log(id)

      switch (event.type) {
        case "checkout.session.completed":
          const session: Stripe.Checkout.Session = event.data.object
          console.log("Checkout session completed", session)
          break
      }
    } catch (error) {
      console.error("An error ocurred while handling the webhook stripe", error)
      throw new InternalServerErrorException("An error ocurred while handling the webhook stripe")
    }
  }

  // ---- Fim da lógica de processar pagamento ---- //
}
