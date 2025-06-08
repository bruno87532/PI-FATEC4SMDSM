import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUpdateProductDto } from './dto/create-update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { Product } from '@prisma/client';
import { GetProductsByIdsDto } from './dto/get-products-by-ids.dto';
import { parse } from 'fast-csv';
import * as fs from "fs";
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { once } from 'events';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
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
      const product = await this.getProductById(id);
      if (!product) throw new BadRequestException("Product not found");
      if (product.idUser !== idUser) throw new ForbiddenException("You do not have permission to update this product");

      await this.googleDriveService.deleteFile(product.idDrive);

      const { updateData, categorys, subCategorys } = await this.prepareUpdateProduct(file, idUser, data);

      await this.prismaService.product.update({
        where: { id },
        data: updateData,
      });

      await this.prismaService.product.update({
        where: { id },
        data: {
          categorys: {
            set: categorys.map(id => ({ id })),
          },
          subCategorys: {
            set: subCategorys.map(id => ({ id })),
          },
        },
      });

    } catch (error) {
      console.error("An error occurred while updating product", error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("An error occurred while updating product");
    }
  }


  private async prepareUpdateProduct(file: Express.Multer.File, idUser: string, data: CreateUpdateProductDto) {
    try {
      const uploaded = await this.googleDriveService.uploadFile(file);
      const idDrive = uploaded.data.id!;
      await this.googleDriveService.makePublicFile(idDrive);

      const { categorys, subCategorys, ...rest } = data;

      return {
        updateData: {
          ...rest,
          idUser,
          idDrive,
        },
        categorys,
        subCategorys,
      };
    } catch (error) {
      console.error("An error occurred while uploading picture to Drive", error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("An error occurred while uploading picture to Drive");
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

  async getProductsByUser(
    userId: string,
    page: number,
    limit: number,
    partialName?: string
  ) {
    const skip = (page - 1) * limit;
    let products: Product[] = []

    try {
      if (partialName) {
        products = await this.prismaService.product.findMany({
          where: { 
            idUser: userId,
            name: {
              contains: partialName,
              mode: "insensitive"
            } 
          },
          skip,
          take: limit,
          orderBy: { id: 'asc' },
          include: {
            categorys: { select: { id: true } },
            subCategorys: { select: { id: true } },
          },
        });
      } else {
        products = await this.prismaService.product.findMany({
          where: { idUser: userId },
          skip,
          take: limit,
          orderBy: { id: 'asc' },
          include: {
            categorys: { select: { id: true } },
            subCategorys: { select: { id: true } },
          },
        });
      }

      if (!products.length) {
        throw new BadRequestException("Products not found");
      }
      return products;
    } catch (error) {
      console.error("An error ocurred while getProductsByUser", error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("An error ocurred while getProductsByUser");
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

  async getProductsByIdUser(idUser: string) {
    try {
      const products = await this.prismaService.product.findMany({
        where: { idUser },
        take: 1000,
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
        },
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
    let quantityImport = 0
    let quantityNoImport = 0
    const products: CreateUpdateProductDto[] = [];
    const user = await this.usersService.getUserById(idUser)

    const stream = fs
      .createReadStream(file.path)
      .pipe(parse({ headers: true, trim: true }));

    stream.on('data', async (row) => {
      stream.pause();
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
          quantityImport += 1
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
          quantityNoImport += 1
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

    await this.emailService.sendEmail(
      {
        to: user.email,
        template: "report",
        subject: "Relatório de importação de produtos",
      },
      {
        quantityImport: quantityImport.toString(),
        quantityNoImport: quantityNoImport.toString(),
        year: new Date().getFullYear().toString()
      }
    )
  }

  async getProductsByPartialNameId(idUser: string, partialName: string) {
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          idUser,
          name: {
            contains: partialName,
            mode: "insensitive"
          }
        }
      })

      if (!products) throw new NotFoundException("Products not found")

      return products
    } catch (error) {
      console.error("An error ocurred while fetching products", error)
      throw new InternalServerErrorException("An error ocurred while fetching products")
    }
  }
}
