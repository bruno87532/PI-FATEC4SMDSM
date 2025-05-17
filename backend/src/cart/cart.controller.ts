import { Controller, Request, UseGuards, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CartService } from "./cart.service";
import { plainToInstance } from "class-transformer";
import { CartResponseDto } from "./dto/cart-response.dto";

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async getCartsByIdUser(@Request() req) {
    return plainToInstance(CartResponseDto, await this.cartService.getCartsByIdUser(req.user.userId))
  }
}