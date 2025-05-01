import { Module } from '@nestjs/common';
import { SubscriptionCancellingController } from './subscription-cancelling.controller';
import { SubscriptionCancellingService } from './subscription-cancelling.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [PrismaModule, SubscriptionModule],
  controllers: [SubscriptionCancellingController],
  providers: [SubscriptionCancellingService]
})
export class SubscriptionCancellingModule {}
