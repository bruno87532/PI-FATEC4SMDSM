import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService
  ) { }

  async getCartByIdUser(idUser: string) {
    try {
      const cart = await this.prismaService.cart.findUnique({ where: { idUser } })
      if (!cart) throw new BadRequestException("Cart not found")
      return cart
    } catch (error) {
      console.error("An error ocurred while fetching cart", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching cart")
    }
  }

  async createCart(idUser: string) {
    try {
      const cart = await this.prismaService.cart.create({
        data: {
          idUser,
        }
      })

      return cart
    } catch (error) {
      console.error("An error ocurred while creating cart", error)
      throw new InternalServerErrorException("An error ocurred while creating cart")
    }
  }

  async incrementPriceCart(id: string, priceToAdd: number) {
    try {
      const updated = await this.prismaService.cart.update({
        where: {
          id
        },
        data: {
          totalPrice: {
            increment: priceToAdd
          }
        }
      })

      return updated
    } catch (error) {
      console.error("An error ocurred while updating cart", error)
      throw new InternalServerErrorException("An error ocurred while updating cart")
    }
  }

  async decrementPriceCart(id: string, priceToRemove: number) {
    try {
      const updated = await this.prismaService.cart.update({
        where: {
          id
        },
        data: {
          totalPrice: {
            decrement: priceToRemove
          }
        }
      })

      return updated
    } catch (error) {
      console.error("An error ocurred while updating cart", error)
      throw new InternalServerErrorException("An error ocurred while updating cart")
    }
  }
}
