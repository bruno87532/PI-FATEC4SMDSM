import Stripe from "stripe";

export interface Subscription extends Stripe.Subscription {
  current_period_end: number;
}