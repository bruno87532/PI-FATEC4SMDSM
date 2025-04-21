import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { google } from "googleapis"
import { GoogleDriveController } from './google-drive.controller';
import { StreamToBufferModule } from 'src/stream-to-buffer/stream-to-buffer.module';

@Module({
  imports: [StreamToBufferModule],
  providers: [
    GoogleDriveService,
    {
      provide: "DRIVE_CLIENT",
      useFactory: async () => {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
          },
          scopes: ["https://www.googleapis.com/auth/drive"],
        })
        return google.drive({ version: "v3", auth }) 
      }
    }
  ],
  exports: [GoogleDriveService],
  controllers: [GoogleDriveController]
})
export class GoogleDriveModule {}
