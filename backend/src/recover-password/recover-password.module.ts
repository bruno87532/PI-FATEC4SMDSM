import { Module } from '@nestjs/common';
import { RecoverPasswordService } from './recover-password.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RecoverPasswordService],
  exports: [RecoverPasswordService]
})
export class RecoverPasswordModule {}
