import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { StreamToBufferService } from 'src/stream-to-buffer/stream-to-buffer.service';

@Injectable()
export class GoogleDriveService {
  constructor(
    @Inject("DRIVE_CLIENT") private readonly driveClient: drive_v3.Drive,
    private readonly streamToBufferService: StreamToBufferService 
  ) { }

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

  async deleteFile(id: string) {
    try {
      await this.driveClient.files.delete({
        fileId: id
      })
    } catch (error) {
      console.error("An error ocurred while deleting file from drive", error)
      throw new InternalServerErrorException("An error ocurred while deleting file from drive")
    }
  }

  async getImageFromDriveById(id: string) {
    try {
      const res = await this.driveClient.files.get({
        fileId: id,
        alt: "media",
        fields: "name, mimeType"
      }, { responseType: "stream" })

      const [fileName, mimeType] = await this.getMetaDataFromDriveById(id)
      const stream = res.data
      const buffer = await this.streamToBufferService.streamToBuffer(stream)

      return { buffer: buffer.toString('base64'), fileName, mimeType }
    } catch (error) {
      console.error("An error ocurred while downloading image from drive")
      throw new InternalServerErrorException("An error ocurred while downloading image from drive")
    }
  }

  private async getMetaDataFromDriveById(id: string) {
    try {
      const res = await this.driveClient.files.get({
        fileId: id,
        fields: "name, mimeType"
      })

      const fileName = res.data.name ?? "image"
      const mimeType = res.data.mimeType ?? "application/octet-stream"

      return [fileName, mimeType]
    } catch (error) {
      console.error("An error ocurred while fetching metadatas from drive")
      throw new InternalServerErrorException("An error ocurred while downloading image from drive")
    }
  }

}
