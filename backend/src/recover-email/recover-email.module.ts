import { Module } from '@nestjs/common';
import { RecoverEmailController } from './recover-email.controller';
import { RecoverEmailService } from './recover-email.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecoverEmailController],
  providers: [RecoverEmailService],
  exports: [RecoverEmailService]
})
export class RecoverEmailModule {}
