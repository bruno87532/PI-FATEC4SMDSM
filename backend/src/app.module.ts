import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { RecoverPasswordModule } from './recover-password/recover-password.module';
import { StripeModule } from './stripe/stripe.module';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ProductModule } from './product/product.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subcategory/subcategory.module';
import { StreamToBufferModule } from './stream-to-buffer/stream-to-buffer.module';
import { CartModule } from './cart/cart.module';
import { ItemModule } from './item/item.module';
import { HighlightProductsModule } from './highlight-products/highlit-products.module';
import { SubscriptionCancellingModule } from './subscription-cancelling/subscription-cancelling.module';
import { RecoverEmailModule } from './recover-email/recover-email.module';
import { EvolutionModule } from './evolution/evolution.module';

@Module({
  imports: [UsersModule, PrismaModule, EmailModule, AuthModule, RecoverPasswordModule, StripeModule, PlanModule, SubscriptionModule, ProductModule, GoogleDriveModule, CategoryModule, ItemModule, SubCategoryModule, CartModule, StreamToBufferModule, HighlightProductsModule, SubscriptionCancellingModule, RecoverEmailModule, EvolutionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
