import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { RecoverModule } from './recover/recover.module';

@Module({
  imports: [UsersModule, PrismaModule, EmailModule, AuthModule, RecoverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
