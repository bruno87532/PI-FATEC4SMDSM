import { Controller, Get } from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get() 
  async getSubCategories() {
    return await this.subCategoryService.getSubCategories()
  }
}
