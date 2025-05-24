import { Controller, Get, Post, UsePipes, ValidationPipe, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { HighlightProductsService } from './highlit-products.service';
import { FeaturedProductByPartialNameDto } from './dto/featured-product-by-partial-name.dto';

@Controller('highlight-products')
export class HighlightProductsController {
  constructor(private readonly highlightProductsService: HighlightProductsService) { }

  @Get("/home")
  async featuredProductHome() {
    return await this.highlightProductsService.featuredProductsHome()
  }

  @Get("/page")
  async featuredProduct() {
    return await this.highlightProductsService.featureProducts()
  }

  @HttpCode(HttpStatus.OK)
  @Post("/home")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async featuredProductHomeByPartialName(@Body() data: FeaturedProductByPartialNameDto) {
    return await this.highlightProductsService.featuredProductsHomeByPartialName(data)
  }

  @HttpCode(HttpStatus.OK)
  @Post("/page")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async featuredProductPageByPartialName(@Body() data: FeaturedProductByPartialNameDto) {
    return await this.highlightProductsService.featuredProductsPageByPartialName(data)
  }
}
