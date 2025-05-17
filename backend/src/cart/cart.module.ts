import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductModule } from 'src/product/product.module';
import { CartController } from './cart.controller';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule {}
