import { HttpException, Injectable, InternalServerErrorException, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { ProductService } from "src/product/product.service";
import { CartService } from "src/cart/cart.service";
import { GetAllItensByIdCartsDto } from "./dto/get-all-itens-by-id-cart.dto";
import { Item } from "@prisma/client";

@Injectable()
export class itemservice {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) { }

  async createItem(data: CreateItemDto, idUser: string) {
    try {
      const product = await this.productService.getProductById(data.idProduct)
      if (product.stock <= 0) throw new ConflictException("Product out of stock")
      let idCart = ""

      const price = product?.promotionExpiration && product?.promotionalPrice && new Date(product.promotionExpiration).getTime() > (new Date()).getTime() ?
        product.promotionalPrice :
        product.regularPrice

      try {
        const existingCart = await this.cartService.getCartByIdAdvertiser(idUser, product.idUser)
        idCart = existingCart.id
      } catch (error) {
        const newCart = await this.cartService.createCart(idUser, product.idUser, price)
        idCart = newCart.id
      }

      await this.productService.decrementStockProduct(data.idProduct, 1)
      const item = await this.prismaService.item.create({
        data: {
          quantity: 1,
          unitPrice: price,
          idProduct: product.id,
          idCart
        }
      })

      return item
    } catch (error) {
      console.error("An error ocurred while creating item", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while creating item")
    }
  }

  async getItemById(id: string) {
    try {
      const item = await this.prismaService.item.findUnique({ where: { id } })
      if (!item) throw new NotFoundException("Item not found")
      return item
    } catch (error) {
      console.error("An error ocurred while fetching item", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching item")
    }
  }

  async deleteItem(id: string, idUser: string) {
    try {
      const item = await this.getItemById(id)
      const idCart = item.idCart
      const cart = await this.cartService.getCartById(idCart)
      if (idUser !== cart.idUser) throw new ForbiddenException("You do not have access to this feature")
      await this.productService.incrementStockProduct(item.idProduct, item.quantity)
      await this.cartService.decrementPrice(idCart, item.quantity * item.unitPrice)
      const deleted = await this.prismaService.item.delete({
        where: { id }
      })
      return deleted
    } catch (error) {
      console.error("An error ocurred while deleting item", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while deleting item")
    }
  }

  async incrementItem(id: string, idUser: string) {
    try {
      const item = await this.getItemById(id)
      const product = await this.productService.getProductById(item.idProduct)
      if (product.stock === 0) throw new BadRequestException("Product out of stock")
      const idCart = item.idCart
      const cart = await this.cartService.getCartById(idCart)
      if (idUser !== cart.idUser) throw new NotFoundException("You do not have access to this feature")
      await this.productService.decrementStockProduct(item.idProduct, 1)
      await this.cartService.incrementPrice(idCart, item.unitPrice)
      const updated = await this.prismaService.item.update({
        where: { id },
        data: {
          quantity: {
            increment: 1
          }
        }
      })
      return updated
    } catch (error) {
      console.error("An error ocurred while incrementing item", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while incrementing item")
    }
  }

  async decrementItem(id: string, idUser: string) {
    try {
      const item = await this.getItemById(id)

      const idCart = item.idCart
      const cart = await this.cartService.getCartById(idCart)

      if (idUser !== cart.idUser) throw new NotFoundException("You do not have access to this feature")

      await this.productService.incrementStockProduct(item.idProduct, 1)
      await this.cartService.decrementPrice(idCart, item.unitPrice)

      const updated = await this.prismaService.item.update({
        where: {
          id
        },
        data: {
          quantity: {
            decrement: 1
          }
        }
      })

      return updated
    } catch (error) {
      console.error("An error ocurred while decrementing item", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while decrementing item")
    }
  }

  async getAllitemsByIdCarts(data: GetAllItensByIdCartsDto): Promise<Item[]> {
    try {
      const items = await this.prismaService.item.findMany({
        where: {
          idCart: {
            in: data.idCarts
          }
        }
      })

      if (!items) throw new NotFoundException("items not found")

      return items
    } catch (error) {
      console.error("An error ocurred while fetching items")
      throw new InternalServerErrorException("An error ocurred while fetching items")
    }
  }

  async deleteItens(ids: string[]) {
    try {
      const deleted = await this.prismaService.item.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      })

      return deleted
    } catch (error) {
      console.error("An error ocurred while deleting itens", error)
      throw new InternalServerErrorException("An error ocurred while deleting itens")
    }
  } 
}
