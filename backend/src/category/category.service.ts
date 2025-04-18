import { Injectable, NotFoundException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) { }

  async getCategories() {
    try {
      const categories = await this.prismaService.category.findMany()

      if (!categories) {
        throw new NotFoundException("Categories not found")
      }

      return categories
    } catch (error) {
      console.error("An error ocurred while fetching categories", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching categories")
    }
  }
}
