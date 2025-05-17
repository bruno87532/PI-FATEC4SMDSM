import { HttpException, Injectable, InternalServerErrorException, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Cart } from "@prisma/client";
// import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) { }

  async createCart(idUser, idAdvertiser, valueInital) {
    try {
      const cart = await this.prismaService.cart.create({
        data: {
          idUser,
          idAdvertiser: idAdvertiser,
          totalPrice: valueInital
        }
      })
      return cart
    } catch (error) {
      console.error("An error ocurred while creating cart", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while creating cart")
    }
  }

  async getCartByIdAdvertiser(idUser: string, idAdvertiser: string): Promise<Cart> {
    try {
      const cart = await this.prismaService.cart.findFirst({
        where: {
          idUser,
          idAdvertiser
        }
      })

      if (!cart) throw new NotFoundException("Cart not found")

      return cart
    } catch (error) {
      console.error("An error ocurred while fetching cart", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching cart")
    }
  }

  async getCartById(id: string) {
    try {
      const cart = await this.prismaService.cart.findUnique({ where: { id } })
      if (!cart) throw new NotFoundException("Cart not found")
      return cart
    } catch (error) {
      console.error("An error ocurred while fetching cart", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching cart")
    }
  }

  async incrementPrice(id: string, value: number) {
    try {
      const cart = this.prismaService.cart.update({
        where: {
          id
        },
        data: {
          totalPrice: {
            increment: value
          }
        }
      })

      return cart
    } catch (error) {
      console.error("An error ocurred while incrementing price", error)
      throw new InternalServerErrorException("An error ocurred while incrementing price")
    }
  }

  async decrementPrice(id: string, value: number) {
    try {
      const cart = this.prismaService.cart.update({
        where: {
          id
        },
        data: {
          totalPrice: {
            decrement: value
          }
        }
      })

      return cart
    } catch (error) {
      console.error("An error ocurred while decrementing price", error)
      throw new InternalServerErrorException("An error ocurred while decrementing price")
    }
  }

  async getCartsByIdUser(idUser: string) {
    try {
      const carts = await this.prismaService.cart.findMany({
        where: { idUser }
      })

      if (carts.length === 0) throw new NotFoundException("Carts not found")

      return carts
    } catch (error) {
      console.error("An error ocurred while fetching items", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching items")
    }
  }

}
