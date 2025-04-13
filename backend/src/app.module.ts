import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { RecoverModule } from './recover/recover.module';
import { StripeModule } from './stripe/stripe.module';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ProductModule } from './product/product.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';

@Module({
  imports: [UsersModule, PrismaModule, EmailModule, AuthModule, RecoverModule, StripeModule, PlanModule, SubscriptionModule, ProductModule, GoogleDriveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
