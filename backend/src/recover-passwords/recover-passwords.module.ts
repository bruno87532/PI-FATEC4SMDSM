import { Module } from '@nestjs/common';
import { RecoverPasswordsService } from './recover-passwords.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RecoverPasswordsService],
  exports: [RecoverPasswordsService]
})
export class RecoverPasswordsModule {}
