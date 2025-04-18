import { Module } from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { SubCategoryController } from './subcategory.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SubCategoryService],
  controllers: [SubCategoryController]
})
export class SubCategoryModule {}
