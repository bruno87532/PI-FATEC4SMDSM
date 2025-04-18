import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubCategoryService {
  constructor(private readonly prismaService: PrismaService) { }

  async getSubCategories() {
    try {
      const subCategories = await this.prismaService.subcategory.findMany()
      
      if (!subCategories) throw new BadRequestException("subCategories not found")

      return subCategories
    } catch (error) {
      console.error("An error ocurred while fetching subcategories", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching subcategories")
    }
  }
}
