import { Controller, Post, UseGuards, Request, Body, UsePipes, ValidationPipe, Delete, Patch, Param, Get } from '@nestjs/common';
import { ItemService } from './item.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateItemDto } from './dto/create-item.dto';
import { plainToInstance } from 'class-transformer';
import { ItemResponseDto } from './dto/item-response.dto';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createItem(
    @Request() req,
    @Body() data: CreateItemDto
  ) {
    return plainToInstance(ItemResponseDto, await this.itemService.createItem(req.user.userId, data.idProduct))
  }

  @Patch("/increment/:id") 
  @UseGuards(AuthGuard("jwt"))
  async incrementQuantityItem(@Request() req, @Param("id") id: string) {
    return plainToInstance(ItemResponseDto, await this.itemService.incrementQuantityItem(req.user.userId, id))
  }

  @Patch("/decrement/:id") 
  @UseGuards(AuthGuard("jwt"))
  async decrementQuantityItem(@Request() req, @Param("id") id: string) {
    return plainToInstance(ItemResponseDto, await this.itemService.decrementQuantityItem(req.user.userId, id))
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteItem(@Request() req, @Param("id") id: string) {
    return plainToInstance(ItemResponseDto, await this.itemService.deleteItem(req.user.userId, id)) 
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete()
  async deleteAllItens(@Request() req) {
    return await this.itemService.deleteAllItens(req.user.userId)
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async getAllItensByIdUser(@Request() req) {
    return plainToInstance(ItemResponseDto, await this.itemService.getAllItensByIdUser(req.user.userId))
  }
}
