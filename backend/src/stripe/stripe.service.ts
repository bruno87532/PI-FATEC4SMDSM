import { Injectable, Inject, InternalServerErrorException, BadRequestException, HttpException } from '@nestjs/common';
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
          await this.handleCheckoutSessionCompleted(session)
          break
        case "invoice.payment_succeeded":
          const invoice: Stripe.Invoice = event.data.object 
          await this.handleInvoicePaymentSucceeded(invoice)
        }
    } catch (error) {
      console.error("An error ocurred while handling the webhook stripe", error)
      throw new InternalServerErrorException("An error ocurred while handling the webhook stripe")
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    try {
      if (typeof session.subscription !== "string") throw new BadRequestException("The subscription must be a string")
        
      const subscription: Stripe.Subscription = await this.stripe.subscriptions.retrieve(session.subscription)
      const idStripe = subscription!.id
      const idPrice = subscription!.items.data[0].plan.id
      const idPlan = (await this.planService.getPlanByIdPrice(idPrice)).id

      const idUser = session.metadata!.id

      const dateUnix = (subscription!.current_period_end + 24 * 60 * 60) * 1000;
      const expirationDate = new Date(dateUnix)
      const data = { idPlan, idUser, expirationDate, idStripe }

      this.usersService.updateUser(idUser, { typeUser: "ADVERTISER" })
      this.subscriptionService.createSubscription(data)
    } catch (error) {
      console.error("Error while processing the checkout session", error)
      throw new InternalServerErrorException("Error while processing the checkout session")
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    try {
      if (invoice.billing_reason !== "subscription_cycle") return null

      const idStripe = invoice.subscription
      if (typeof idStripe !== "string") throw new BadRequestException("The idStripe must be a string")
      const { id, idUser } = await this.subscriptionService.getSubscriptionByIdStripe(idStripe) 
      const subscription = await this.stripe.subscriptions.retrieve(idStripe)

      const dateUnix = (subscription.current_period_end + 24 * 60 * 60) * 1000
      const expirationDate = new Date(dateUnix)

      await this.subscriptionService.updateSubscription(id, expirationDate)
      const data: { typeUser: "COMMON" } | { typeUser: "ADVERTISER" } = { typeUser: "ADVERTISER" }
      await this.usersService.updateUser(idUser, data)
    } catch (error) {
      console.error("Error while processing the invoice payment succeeded", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("Error while processing the invoice payment succeeded")
    }
  }
  // ---- Fim da lógica de processar pagamento ---- //
}
