import { Module } from '@nestjs/common';
import { RecoverService } from './recover.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RecoverService],
  exports: [RecoverService]
})
export class RecoverModule {}
