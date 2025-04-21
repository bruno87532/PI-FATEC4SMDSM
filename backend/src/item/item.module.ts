import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  exports: [ItemService],
  imports: [PrismaModule, CartModule, ProductModule],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
