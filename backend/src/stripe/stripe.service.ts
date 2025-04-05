import { Injectable, Inject, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { PlanService } from 'src/plan/plan.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StripeService {
  constructor(
    @Inject("STRIPE_CLIENT") private readonly stripe: Stripe,
    private readonly subscriptionService: SubscriptionService,
    private readonly planService: PlanService,
    private readonly usersService: UsersService
  ) { }

  // ---- Início da lógica de criação de checkout ---- //

  async createCheckout(price: string, user: { userId: string }) {
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
        metadata: {
          id: user.userId
        },
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

  async paymentSucessfully(data: Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ""
    const dataToString = data.toString()

    try {
      const event = this.stripe.webhooks.constructEvent(
        dataToString,
        signature,
        endpointSecret
      )

      switch (event.type) {
        case "checkout.session.completed":
          const session: Stripe.Checkout.Session = event.data.object
          this.handleCheckoutSessionCompleted(session)
          break
      }
    } catch (error) {
      console.error("An error ocurred while handling the webhook stripe", error)
      throw new InternalServerErrorException("An error ocurred while handling the webhook stripe")
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    try {
      let subscription: Stripe.Subscription | null = null
      if (typeof session.subscription === "string") {
        subscription = await this.stripe.subscriptions.retrieve(session.subscription)
      }

      const idPrice = subscription!.items.data[0].plan.id
      const idPlan = (await this.planService.getPlanByIdPrice(idPrice)).id

      const idUser = session.metadata!.id

      const dateUnix = (subscription!.current_period_end + 24 * 60 * 60) * 1000
      const expirationDate = new Date(dateUnix)
      const data = { idPlan, idUser, expirationDate }

      this.usersService.updateUser(idUser, { typeUser: "ADVERTISER" })
      this.subscriptionService.createSubscription(data)
    } catch (error) {
      console.error("Error while processing the checkout session", error)
      throw new InternalServerErrorException("Error while processing the checkout session")
    }
  }
  // ---- Fim da lógica de processar pagamento ---- //
}
