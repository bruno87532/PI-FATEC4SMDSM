import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartService: CartService,
    private readonly productService: ProductService
  ) { }

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

  private async existingItem(idProduct: string, idCart: string) {
    try {
      const itens = await this.prismaService.item.findMany({
        where: {
          idCart
        }
      })

      itens.forEach((item) => {
        if (item.idProduct === idProduct) throw new ConflictException("Item was created")
      })

    } catch (error) {
      console.error("An error ocurred while fetching item", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching item")
    }
  }

  async createItem(idUser: string, idProduct: string) {
    try {
      const cart = await this.cartService.getCartByIdUser(idUser)
      if (!cart) throw new NotFoundException("Cart not found")

      await this.existingItem(idProduct, cart.id)
      
      const product = await this.productService.getProductById(idProduct)
      if (!product) throw new NotFoundException("Product not found")
      if (product.stock <= 0) throw new ConflictException("Product out of stock")

      const price = product?.promotionExpiration && product?.promotionalPrice && new Date(product.promotionExpiration).getTime() > (new Date()).getTime() ?
        product.promotionalPrice :
        product.regularPrice

      const item = await this.prismaService.item.create({
        data: {
          idCart: cart.id,
          quantity: 1,
          idProduct,
          unitPrice: price
        }
      })

      await this.cartService.incrementPriceCart(cart.id, price)
      await this.productService.decrementStockProduct(idProduct, 1)
      return item
    } catch (error) {
      console.error("An error ocurred while creating item")
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while creating item")
    }
  }

  async incrementQuantityItem(idUser: string, id: string) {
    try {
      const cart = await this.cartService.getCartByIdUser(idUser)
      if (!cart) throw new NotFoundException("Cart not found")

      const item = await this.getItemById(id)
      if (item.idCart !== cart.id) throw new ForbiddenException("You do not have permission to update this item")

      const product = await this.productService.getProductById(item.idProduct)
      if (!product) throw new NotFoundException("Product not found")
      if (product.stock <= 0) throw new ConflictException("Product out of stock")

      const updated = await this.prismaService.item.update({
        where: { id },
        data: {
          quantity: {
            increment: 1
          }
        }
      })

      await this.productService.decrementStockProduct(updated.idProduct, 1)
      await this.cartService.incrementPriceCart(cart.id, updated.unitPrice)

      return item
    } catch (error) {
      console.error("An error ocurred while updating item", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while updating item")
    }
  }

  async decrementQuantityItem(idUser: string, id: string) {
    try {
      const [cart, item] = await this.allowedResource(idUser, id)

      const updated = await this.prismaService.item.update({
        where: { id },
        data: {
          quantity: {
            decrement: 1
          }
        }
      })

      await this.productService.incrementStockProduct(updated.idProduct, 1)
      await this.cartService.decrementPriceCart(cart.id, updated.unitPrice)

      return item
    } catch (error) {
      console.error("An error ocurred while updating item", error)
      throw new InternalServerErrorException("An error ocurred while updating item")
    }
  }

  async deleteItem(idUser: string, id: string) {
    try {
      const [cart, item] = await this.allowedResource(idUser, id)

      const deleted = await this.prismaService.item.delete({
        where: { id }
      })

      await this.cartService.decrementPriceCart(cart.id, deleted.quantity * deleted.unitPrice)
      await this.productService.incrementStockProduct(deleted.idProduct, deleted.quantity)
      return deleted
    } catch (error) {
      console.error("An error ocurred while deleting item", error)
      throw new InternalServerErrorException("An error ocurred while deleting item")
    }
  }

  async deleteAllItens(idUser: string) {
    try {
      const deleted = await this.prismaService.cart.deleteMany({
        where: { idUser }
      })

      return deleted
    } catch (error) {
      console.error("An error ocurrd while deleting all itens", error)
      throw new InternalServerErrorException("An error ocurrd while deleting all itens")
    }
  }

  private async allowedResource(idUser: string, id: string) {
    const cart = await this.cartService.getCartByIdUser(idUser)
    if (!cart) throw new NotFoundException("Cart not found")

    const item = await this.getItemById(id)
    if (item.idCart !== cart.id) throw new ForbiddenException("You do not have permission to acess this item")

    return [cart, item]
  }

  async getAllItensByIdUser(idUser: string) {
    try {
      const cart = await this.cartService.getCartByIdUser(idUser)

      const itens = await this.prismaService.item.findMany({
        where: { idCart: cart.id }
      })

      if (!itens) throw new NotFoundException("Itens not found")

      return itens
    } catch (error) {
      console.error("An error ocurred while creating itens", error) 
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while creating itens")
    }
  }
}
