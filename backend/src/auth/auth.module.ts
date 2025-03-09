import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RecoverModule } from 'src/recover/recover.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, RecoverModule, EmailModule]
})
export class AuthModule {}
