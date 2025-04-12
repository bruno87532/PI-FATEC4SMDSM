import { Injectable } from '@nestjs/common';
import { diskStorage, Options, FileFilterCallback } from 'multer';
import * as path from "path"
import { Request } from 'express';

@Injectable()
export class MulterService {
  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
          cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extname && mimeType) {
          return cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only jpeg, jpg, png are allowed.'));
        }
      },
      limits: { fileSize: 1 * 1024 * 1024 },
    };
  }
}
