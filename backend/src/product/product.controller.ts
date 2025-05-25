import { Body, Controller, Post, Query, UseGuards, UsePipes, ValidationPipe, Request, UseInterceptors, UploadedFile, Get, Param, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUpdateProductDto } from './dto/create-update-product.dto';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagePipe } from 'src/common/pipes/validate-square-image.pipe';
import { DeleteProductByIdsDto } from './dto/delete-product-by-ids.dto';
import { GetProductsByIdsDto } from './dto/get-products-by-ids.dto';
import { diskStorage } from 'multer';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor("file", {
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/
      const isValid = allowed.test(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error('Apenas imagens são permitidas!'), false)
    },
  }))
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async CreateProduct(
    @Body() data: CreateUpdateProductDto,
    @UploadedFile(ValidateImagePipe) file: Express.Multer.File,
    @Request() req,
  ) {
    return await this.productService.createProduct(data, req.user.userId, file)
  }


  @Post('/csv')
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './csv',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return await this.productService.uploadCsv(file, req.user.userId)
  }

  @Get("/me/:id")
  @UseGuards(AuthGuard("jwt"))
  async getProductById(@Param("id") id: string) {
    return await this.productService.getProductById(id)
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getProductsByUser(
    @Request() req,
    @Query("page") page = "1",
    @Query("limit") limit = "20",
    @Query("partialName") partialName = ""
  ) {
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    return this.productService.getProductsByUser(
      req.user.userId,
      pageNum,
      limitNum,
      partialName
    )
  }

  @Post("/delete-many") // Apesar de ser um DELETE, estou usando POST porque espera um corpo de requisição e para evitar incompatibilidade de cliente que não permite delete com body
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseGuards(AuthGuard("jwt"))
  async deleteProductByIds(@Request() req, @Body() data: DeleteProductByIdsDto) {
    return await this.productService.deleteProductById(data.ids, req.user.userId)
  }

  @Put("/me/:id")
  @UseInterceptors(FileInterceptor("file", {
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/
      const isValid = allowed.test(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error('Apenas imagens são permitidas!'), false)
    },
  }))
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateProduct(
    @Request() req,
    @Body() data: CreateUpdateProductDto,
    @Param("id") id: string,
    @UploadedFile(ValidateImagePipe) file: Express.Multer.File
  ) {
    return await this.productService.updateProduct(data, id, req.user.userId, file)
  }

  @Post("/get-products-by-ids")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseGuards(AuthGuard("jwt"))
  async getProductsByIds(@Body() data: GetProductsByIdsDto) {
    return await this.productService.getProductsByIds(data)
  }
}
