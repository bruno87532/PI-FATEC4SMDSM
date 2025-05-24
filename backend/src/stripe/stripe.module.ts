import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';
import { AuthModule } from 'src/auth/auth.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { PlanModule } from 'src/plan/plan.module';
import { UsersModule } from 'src/users/users.module';
import { CartModule } from 'src/cart/cart.module';
import { ItemModule } from 'src/item/item.module';
import { ProductModule } from 'src/product/product.module';
import { EvolutionModule } from 'src/evolution/evolution.module';

@Module({
  imports: [AuthModule, SubscriptionModule, PlanModule, UsersModule, CartModule, ItemModule, ProductModule, EvolutionModule],
  providers: [
    StripeService,
    {
      provide: "STRIPE_CLIENT",
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
          apiVersion: "2025-02-24.acacia"
        })
      }
    }
  ],
  controllers: [StripeController],
  exports: ["STRIPE_CLIENT", StripeService]
})
export class StripeModule {}
