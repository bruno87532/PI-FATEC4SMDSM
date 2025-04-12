import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(data: CreateProductDto, idUser: string, imagePath: string) {
    try {
      const { category, subCategory, ...newData } = data
      const productData = {
        ...newData,
        idUser,
        subCategorys: {
          connect: subCategory.map(id => ({ id })),
        },
        categorys: {
          connect: category.map(id => ({ id }))
        },
        imagePath
      }

      const product = await this.prismaService.product.create({
        data: productData
      })
    } catch (error) {
      console.error("An error ocurred while creating product", error)
      throw new InternalServerErrorException("An error ocurred while creating product")
    }
  }
}
