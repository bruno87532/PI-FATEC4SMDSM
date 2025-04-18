import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService
  ) { }

  async createProduct(data: CreateProductDto, idUser: string, file: Express.Multer.File) {
    try {
      const idDrive = (await this.googleDriveService.uploadFile(file)).data.id!
      await this.googleDriveService.makePublicFile(idDrive)
      const { categorys, subCategorys, ...newData } = data
      const productData = {
        ...newData,
        idUser,
        subCategorys: {
          connect: subCategorys.map(id => ({ id })),
        },
        categorys: {
          connect: categorys.map(id => ({ id }))
        },
        idDrive
      }

      return await this.prismaService.product.create({
        data: productData
      })
    } catch (error) {
      console.error("An error ocurred while creating product", error)
      throw new InternalServerErrorException("An error ocurred while creating product")
    }
  }

  async getProductsById(idUser: string) {
    try {
      const products = await this.prismaService.product.findMany({
        where: { idUser }
      })

      if (!products) {
        throw new BadRequestException("Products not found")
      }

      return products
    } catch (error) {
      console.error("An error ocurred while fetching products", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching products")
    }
  }
}
