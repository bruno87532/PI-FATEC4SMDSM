import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common"
import * as sharp from "sharp"

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  private validateSquareImage(metadata: sharp.Metadata) {
    if (metadata.width !== metadata.height) {
      throw new BadRequestException("The image and width must be equal")
    }
  }

  private async resizeImage(image: sharp.Sharp) {
    return await image.resize(200, 200).toBuffer()
  }
  async transform(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException("The file is required")
    }

    const image = sharp(file.buffer)
    
    const metadata = await image.metadata()
    this.validateSquareImage(metadata)

    file.buffer = await this.resizeImage(image)
    return file
  }
}