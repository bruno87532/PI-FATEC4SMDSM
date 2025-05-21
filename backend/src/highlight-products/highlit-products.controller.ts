import { Controller, Get } from '@nestjs/common';
import { HighlightProductsService } from './highlit-products.service';

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
}
