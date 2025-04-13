import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { drive_v3 } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  constructor(@Inject("DRIVE_CLIENT") private readonly driveClient: drive_v3.Drive) { }

  async uploadFile(file: Express.Multer.File) {
    const stream = Readable.from(file.buffer)
    try {
      const res = await this.driveClient.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
          parents: ["1UKoY2jH60qV7wChyinbgXFBUi5_TN3Qh"]
        },
        media: {
          mimeType: file.mimetype,
          body: stream
        }
      })

      return res
    } catch (error) {
      console.error("An error ocurred while uploading the file to google drive", error)
      throw new InternalServerErrorException("An error ocurred while uploading the file to google drive")
    }
  }

  async makePublicFile(id: string) {
    try {
      const res = await this.driveClient.permissions.create({
        fileId: id,
        requestBody: {
          role: "reader",
          type: "anyone"
        }
      }) 
    } catch (error) {
      console.error("An error ocurred while leaving public file in the google drive", error)
      throw new InternalServerErrorException("An error ocurred while leaving public file in the google drive")
    }
  }
}
