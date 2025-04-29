import { Controller, Get } from '@nestjs/common';
import { HighlightProductsService } from './highlit-products.service';

@Controller('highlight-products')
export class HighlightProductsController {
  constructor (private readonly highlightProductsService: HighlightProductsService) { }

  @Get()
  async featuredProductHome() {
    return await this.highlightProductsService.featuredProductsHome() 
  }
}
