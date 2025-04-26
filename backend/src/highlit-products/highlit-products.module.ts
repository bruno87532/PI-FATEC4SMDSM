import { Module } from '@nestjs/common';
import { HighlitProductsController } from './highlit-products.controller';
import { HighlitProductsService } from './highlit-products.service';
import { PlanModule } from 'src/plan/plan.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [PlanModule, SubscriptionModule, ProductModule],
  controllers: [HighlitProductsController],
  providers: [HighlitProductsService]
})
export class HighlitProductsModule {}
