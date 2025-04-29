import { Module } from '@nestjs/common';
import { HighlightProductsController } from './highlit-products.controller';
import { HighlightProductsService } from './highlit-products.service';
import { PlanModule } from 'src/plan/plan.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ProductModule } from 'src/product/product.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PlanModule, SubscriptionModule, ProductModule, UsersModule],
  controllers: [HighlightProductsController],
  providers: [HighlightProductsService]
})
export class HighlightProductsModule {}
