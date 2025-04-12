import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterService } from 'src/multer/multer.service';

@Module({
  imports: [PrismaModule, MulterService],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
