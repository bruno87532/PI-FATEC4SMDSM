import { Controller, Request, ValidationPipe, UsePipes, Body, UseGuards, Post, Get, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RemoveProductsDto } from './dto/remove-products.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async getCartByIdUser(@Request() req) {
    return await this.cartService.getCartByIdUser(req.user.userId)
  }

  // @Post()
  // @UseGuards(AuthGuard("jwt"))
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // async addProduct(@Request() req, @Body() data: AddProductDto) {
  //   return await this.cartService.addProduct(req.user.id, data.id)
  // }

  // @Post()
  // @UseGuards(AuthGuard("jwt"))
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // async removeProducts(@Request() req, @Body() data: RemoveProductsDto) {
  //   return await this.cartService.removeProducts(req.user.userId, data.ids)  
  // }
}
