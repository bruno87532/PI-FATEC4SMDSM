import { Injectable, Inject, InternalServerErrorException, BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { PlanService } from 'src/plan/plan.service';
import { UsersService } from 'src/users/users.service';
import { Subscription } from '@prisma/client';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { itemservice } from 'src/item/item.service';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { EvolutionService } from 'src/evolution/evolution.service';

@Injectable()
export class StripeService {
  constructor(
    @Inject("STRIPE_CLIENT") private readonly stripe: Stripe,
    private readonly subscriptionService: SubscriptionService,
    private readonly planService: PlanService,
    private readonly usersService: UsersService,
    private readonly itemService: itemservice, 
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly evolutionService: EvolutionService
  ) { }

  // ---- Início da lógica de criação de checkout ---- //

  async createCheckout(price: string, userId: string) {
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
          id: userId
        },
        ui_mode: "embedded",
        return_url: (process.env.PATH_FRONTEND ?? "") + "/purchase-confirmation?payment-confirmation&session_id={CHECKOUT_SESSION_ID}"
      })
      return session
    } catch (error) {
      console.error("An error ocurred while creating checkout stripe", error)
      throw new InternalServerErrorException("An error ocurred while creating checkout stripe")
    }
  }

  async createPurchase(data: CreatePurchaseDto, idUser: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: "Finalizar compra",
              },
              unit_amount: data.totalPrice
            },
            quantity: 1
          }
        ],
        metadata: {
          id: idUser,
          idAdvertiser: data.idUserAdvertiser,
        },
        ui_mode: "embedded",
        return_url: `${process.env.PATH_FRONTEND}/purchase-cart-confirmation?payment-confirmation&session_id={CHECKOUT_SESSION_ID}`
      })

      return session
    } catch (error) {
      console.error("An error ocurred while creating checkout stripe", error)
      throw new InternalServerErrorException("An error ocurred while creating checkout stripe")
    }
  }

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
          if (session.metadata?.idAdvertiser) {
            await this.handlePurchase(session)
          } else {
            await this.handleCheckoutSessionCompleted(session)
          }
          break
        case "invoice.payment_succeeded":
          const invoice: Stripe.Invoice = event.data.object
          await this.handleInvoicePaymentSucceeded(invoice)
          break
        case "customer.subscription.deleted":
          const subscription: Stripe.Subscription = event.data.object
          await this.handleCustomerSubscriptionDeleted(subscription)
      }

      return { message: "action processed successfully" }
    } catch (error) {
      console.error("An error ocurred while handling the webhook stripe", error)
      throw new InternalServerErrorException("An error ocurred while handling the webhook stripe")
    }
  }

  private async handlePurchase(session: Stripe.Checkout.Session) {
    try {
      if (!session.metadata) throw new BadRequestException("metadata is required")
      if (!session.metadata.idAdvertiser || ! session.metadata.id) throw new BadRequestException("idAdvertiser and id are required")
      
      const idAdvertiser = session.metadata.idAdvertiser
      const id = session.metadata.id

      const user = await this.usersService.getUserById(id)
      const advertiser = await this.usersService.getUserById(idAdvertiser)
      const cart = await this.cartService.getCartByIdAdvertiser(id, idAdvertiser)
      const itens = await this.itemService.getAllitemsByIdCarts({ idCarts: [cart.id] })

      let template = `O(a) ${user.name}, residente no endereço:\nCidade: ${user.city}\nBairro: ${user.neighborhood}\nRua: ${user.road}\nNúmero: ${user.marketNumber}\nNúmero de telefone: ${user.phone}\nComprou os seguintes produtos:\n`
      let ids: string[] = []

      for (const item of itens) {
        console.log(item)
        ids.push(item.id)
        const product = await this.productService.getProductById(item.idProduct)
        template += `Produto: ${product.name}\nQuantidade: ${item.quantity}\n`
      }
      console.log(ids)
      await this.itemService.deleteItens(ids)
      await this.evolutionService.sendMessage(advertiser.phone!, template)

    } catch (error) {
      console.error("Error while processing the checkout session", error)
      throw new InternalServerErrorException("Error while processing the checkout session")
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    try {
      if (typeof session.subscription !== "string") throw new BadRequestException("The subscription must be a string")
      const idUser = session.metadata!.id
      await this.unsubscribeImmediately(idUser)

      const subscription: Stripe.Subscription = await this.stripe.subscriptions.retrieve(session.subscription)
      const idStripe = subscription!.id
      const idPrice = subscription!.items.data[0].plan.id
      const idPlan = (await this.planService.getPlanByIdPrice(idPrice)).id


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

      await this.subscriptionService.updateSubscription(id, { expirationDate })
      const data: { typeUser: "COMMON" } | { typeUser: "ADVERTISER" } = { typeUser: "ADVERTISER" }
      await this.usersService.updateUser(idUser, data)
    } catch (error) {
      console.error("Error while processing the invoice payment succeeded", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("Error while processing the invoice payment succeeded")
    }
  }

  private async handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {
    try {
      const idStripe = subscription.id
      const id = (await this.subscriptionService.getSubscriptionByIdStripe(idStripe)).id
      await this.subscriptionService.updateSubscription(id, { isActivate: false })
    } catch (error) {
      console.error("Error while processing the customer subscription deleted", error)
      throw new InternalServerErrorException("Error while processing the customer subscription deleted")
    }
  }
  async cancelSubscription(idUser: string) {
    try {
      const arraySubscription = await this.subscriptionService.getSubscriptionsByIdUser(idUser)
      let subscriptionActivate: Subscription | null = null
      for (const subscription of arraySubscription) {
        if (subscription.isActivate === true) {
          subscriptionActivate = subscription
        }
      }
      if (typeof subscriptionActivate?.idStripe !== "string") throw new BadRequestException("idStripe must be a string")
      const stripeCancel = await this.stripe.subscriptions.update(subscriptionActivate.idStripe, { cancel_at_period_end: true })

      return { message: "subscription canceled successfully" }
    } catch (error) {
      console.error("An error ocurred while canceling subscription", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while canceling subscription")
    }
  }

  private async unsubscribeImmediately(idUser: string) {
    try {
      const subscription = await this.subscriptionService.getSubscriptionActiveByIdUser(idUser)
      await this.subscriptionService.updateSubscription(subscription.id, {
        isActivate: false
      })
      await this.stripe.subscriptions.cancel(subscription.idStripe)
    } catch (error) {
      console.error("There is no active subscription")
    }
  }

  async reactivateSubscription(idUser: string) {
    try {
      const subscriptions = await this.subscriptionService.getSubscriptionsByIdUser(idUser);

      let recentSubscription = subscriptions[0];

      subscriptions.forEach((subscription) => {
        if (new Date(recentSubscription.expirationDate).getTime() > new Date(subscription.expirationDate).getTime() && subscription.isActivate) {
          recentSubscription = subscription;
        }
      });

      if (!recentSubscription.isActivate) throw new BadRequestException("Unable to reactivate subscription")
      if (new Date().getTime() > new Date(recentSubscription.expirationDate).getTime()) throw new BadRequestException("Current date greather than expiration date")

      await this.stripe.subscriptions.update(recentSubscription.idStripe, {
        cancel_at_period_end: false
      })

      return { message: "Subscription reactivated successfully" }
    } catch (error) {
      console.error("An error ocurred while reactiving subscription", error);
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while reactiving subscription");
    }
  }
}
