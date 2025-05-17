import { Controller, UseGuards, ValidationPipe, UsePipes, Body, Post, Request, Delete, Patch, Param } from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { itemservice } from "./item.service";
import { AuthGuard } from "@nestjs/passport";
import { GetAllItensByIdCartsDto } from "./dto/get-all-itens-by-id-cart.dto";

@Controller('item')
export class ItemController {
  constructor(private readonly itemservice: itemservice) { }

  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Post()
  async createItem(@Body() data: CreateItemDto, @Request() req) {
    return await this.itemservice.createItem(data, req.user.userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Delete("/:id")
  async deleteItem(@Param("id") id: string, @Request() req) {
    return await this.itemservice.deleteItem(id, req.user.userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Patch("/increment/:id")
  async incrementItem(@Param("id") id: string, @Request() req) {
    return await this.itemservice.incrementItem(id, req.user.userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Patch("/decrement/:id")
  async decrementItem(@Param("id") id: string, @Request() req) {
    return await this.itemservice.decrementItem(id, req.user.userId)
  }

  @UsePipes(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Post("/get-all-itens-by-id-carts")
  async getAllIItensByIdCarts(@Body() data: GetAllItensByIdCartsDto) {
    return await this.itemservice.getAllitemsByIdCarts(data)
  }
}
