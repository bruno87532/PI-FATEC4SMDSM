import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RecoverPasswordsModule } from 'src/recover-passwords/recover-passwords.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, RecoverPasswordsModule, EmailModule]
})
export class AuthModule {}
