import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RecoverModule } from 'src/recover/recover.module';
import { EmailModule } from 'src/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    RecoverModule,
    EmailModule,
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '1d'
      }
    })
  ],
  exports: [AuthService]
})
export class AuthModule { }
