import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUpdateProductDto } from './dto/create-update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { Product } from '@prisma/client';
import { GetProductsByIdsDto } from './dto/get-products-by-ids.dto';
import { parse } from 'fast-csv';
import * as fs from "fs";
import { Product as ProductInterface } from 'src/interfaces/product.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { once } from 'events';

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
      const product = await this.getProductById(id)
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

  async getProductById(id: string): Promise<Product> {
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

      if (!product) throw new NotFoundException("Product not found")

      return product
    } catch (error) {
      console.error("An error ocurred while fetching product", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching product")
    }
  }

  async decrementStockProduct(id: string, quantity: number) {
    try {
      const product = await this.prismaService.product.update({
        where: { id },
        data: {
          stock: {
            decrement: quantity
          }
        }
      })

      return product
    } catch (error) {
      console.error("An error ocurred while decreasing the product stock", error)
      throw new InternalServerErrorException("An error ocurred while decreasing the product stock")
    }
  }

  async incrementStockProduct(id: string, quantity: number) {
    try {
      const product = await this.prismaService.product.update({
        where: { id },
        data: {
          stock: {
            increment: quantity
          }
        }
      })

      return product
    } catch (error) {
      console.error("An error ocurred while incrementing the product stock", error)
      throw new InternalServerErrorException("An error ocurred while incrementing the product stock")
    }
  }

  async getProductsByIds(data: GetProductsByIdsDto) {
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          id: {
            in: data.ids
          }
        }
      })

      if (!products) throw new NotFoundException("Products not found")

      return products
    } catch (error) {
      console.error("An error ocurred while fetching products", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching products")
    }
  }

  async uploadCsv(file: Express.Multer.File, idUser: string) {
    const products: CreateUpdateProductDto[] = [];

    const stream = fs
      .createReadStream(file.path)
      .pipe(parse({ headers: true, trim: true }));

    stream.on('data', async (row) => {
      stream.pause();

      // Remove a descrição se estiver vazia ou for menor que 2 caracteres
      if (!row.description || row.description.trim().length < 2) {
        delete row.description;
      }

      const productData = {
        ...row,
        categorys: ["0"],
        subCategorys: ["0"],
      };

      try {
        const dto = plainToInstance(CreateUpdateProductDto, productData);
        const errors = await validate(dto);

        if (errors.length === 0) {
          const product: CreateUpdateProductDto = {
            categorys: ["0"],
            subCategorys: ["0"],
            name: dto.name,
            ...(dto.description ? { description: dto.description } : {}),
            regularPrice: dto.regularPrice,
            ...(dto.promotionalPrice ? { promotionalPrice: dto.promotionalPrice } : {}),
            ...(dto.promotionStart ? { promotionStart: new Date(dto.promotionStart) } : {}),
            ...(dto.promotionExpiration ? { promotionExpiration: new Date(dto.promotionExpiration) } : {}),
            stock: dto.stock,
          };

          products.push(product);
        } else {
          console.warn('Validation errors:', errors);
        }
      } catch (error) {
        console.warn('Error processing line:', productData, error);
      }

      stream.resume();
    });

    await once(stream, 'end');

    for (const product of products) {
      await this.prismaService.product.create({
        data: {
          name: product.name,
          description: product.description,
          regularPrice: product.regularPrice,
          promotionalPrice: product.promotionalPrice,
          promotionStart: product.promotionStart,
          promotionExpiration: product.promotionExpiration,
          stock: product.stock,
          idUser,
          idDrive: "1yyqC24eHfXlEq2Ob-ffMPkUkUKk36WAQ",
          categorys: {
            connect: [{ id: "0" }],
          },
          subCategorys: {
            connect: [{ id: "0" }],
          },
        },
      });
    }
  }

}
