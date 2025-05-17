import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { itemservice } from './item.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  exports: [itemservice],
  imports: [PrismaModule, CartModule, ProductModule],
  controllers: [ItemController],
  providers: [itemservice]
})
export class ItemModule {}
