import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { MulterService } from 'src/multer/multer.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly multerServvice: MulterService
  ) {}
  
  @Post()
  @UseInterceptors(FileInterceptor("image", new MulterService().getMulterConfig()))
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async CreateProduct(
    @Body() data: CreateProductDto, 
    @Request() req,
    @UploadedFile() image: Express.Multer.File
  ) {
    const imagePath = image?.filename
    return await this.productService.createProduct(data, req.user.id, imagePath)
  }
}
