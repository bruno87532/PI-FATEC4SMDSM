import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request, UseInterceptors, UploadedFile, Get, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagePipe } from 'src/common/pipes/validate-square-image.pipe';
import { DeleteProductByIdsDto } from './dto/delete-product-by-ids.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor("file", {
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png/
      const isValid = allowed.test(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error('Apenas imagens são permitidas!'), false)
    },
  }))
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async CreateProduct(
    @Body() data: CreateProductDto,
    @UploadedFile(ValidateImagePipe) file: Express.Multer.File,
    @Request() req,
  ) {
    return await this.productService.createProduct(data, req.user.userId, file)
  }

  @Get("/me")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getProductsById(@Request() req) {
    return await this.productService.getProductsById(req.user.userId)
  }

  @Post("/delete-many") // Apesar de ser um DELETE, estou usando POST porque espera um corpo de requisição e para evitar incompatibilidade de cliente que não permite delete com body
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseGuards(AuthGuard("jwt"))
  async deleteProductByIds(@Body() data: DeleteProductByIdsDto) {
    return await this.productService.deleteProductById(data.ids)
  }
}
