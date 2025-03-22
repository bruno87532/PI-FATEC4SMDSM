import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { ProductEnum } from './enum/product.enum';
import Stripe from "stripe"

@Injectable()
export class StripeService {
    constructor(@Inject("STRIPE") private readonly stripe: Stripe) { }

    async createCheckout(data: CreateCheckoutDto) {
        const { product } = data;
        const idProduct = Object.keys(ProductEnum).find(key => ProductEnum[key] === product)
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: idProduct,
                        quantity: 1
                    },
                ],
                mode: "subscription",
                ui_mode: "embedded",
                return_url: `http://localhost:3000/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
            })
            return session
        } catch (error) {
            console.error(`An error ocurred while creating a stripe session:`, error)
            throw new InternalServerErrorException("An error ocurred while creating a stripe session")
        }
    }
}
