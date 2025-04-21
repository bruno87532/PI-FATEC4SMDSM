import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('google-drive')
export class GoogleDriveController {
  constructor (private readonly googleDriveService: GoogleDriveService) {}

  @Get(":id")
  async getImageFromDriveById(@Param("id") id: string) {
    return await this.googleDriveService.getImageFromDriveById(id)
  }
}
