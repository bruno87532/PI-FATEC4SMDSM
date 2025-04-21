import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUpdateProductDto } from './dto/create-update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService
  ) { }

  async createProduct(data: CreateUpdateProductDto, idUser: string, file: Express.Multer.File) {
    try {
      const productData = await this.prepareProduct(file, idUser, data)
      return await this.prismaService.product.create({
        data: productData
      })
    } catch (error) {
      console.error("An error ocurred while creating product", error)
      throw new InternalServerErrorException("An error ocurred while creating product")
    }
  }

  async updateProduct(data: CreateUpdateProductDto, id: string, idUser: string, file: Express.Multer.File) {
    try {
      const product = await this.prismaService.product.findUnique({ where: { id } })
      if (!product) throw new BadRequestException("Product not found")
      if (product.idUser !== idUser) throw new ForbiddenException("You do not have permission to update this product")

      await this.googleDriveService.deleteFile(product.idDrive)
      const productData = await this.prepareProduct(file, idUser, data)
      const updated = await this.prismaService.product.update({
        where: { id },
        data: productData
      })

    } catch (error) {
      console.error("An error ocurred while updating product", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while updating product")
    }
  }

  private async prepareProduct(file: Express.Multer.File, idUser: string, data: CreateUpdateProductDto) {
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

      return productData
    } catch (error) {
      console.error("An error ocurred while inserting picture on the drive", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while inserting picture on the drive")
    }
  }

  async getProductsByIdUser(idUser: string) {
    try {
      const products = await this.prismaService.product.findMany({
        where: { idUser },
        include: {
          categorys: {
            select: {
              id: true
            }
          },
          subCategorys: {
            select: {
              id: true
            }
          }
        }
      })

      if (!products || products.length === 0) {
        throw new BadRequestException("Products not found")
      }
      return products
    } catch (error) {
      console.error("An error ocurred while fetching products", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching products")
    }
  }

  async deleteProductById(ids: string[], idUser: string) {
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          id: { in: ids }
        }
      })
      const allowed = products.every((product) => product.idUser === idUser)
      if (!allowed) throw new ForbiddenException("You do not have permission to delete these products")

      const deleted = await this.prismaService.product.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      })

      if (deleted.count === 0) throw new BadRequestException("Products not found")

      return deleted
    } catch (error) {
      console.error("An error ocurred while deleting product", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while deleting product")
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
        include: {
          categorys: {
            select: {
              id: true
            }
          },
          subCategorys: {
            select: {
              id: true
            }
          }
        }
      })

      if (!product) new BadRequestException("Product not found")

      return product
    } catch (error) {
      console.error("An error ocurred while fetching product", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching product")
    }
  }
}
