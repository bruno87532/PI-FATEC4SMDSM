import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [PrismaModule, EmailModule]
})
export class UsersModule {}
