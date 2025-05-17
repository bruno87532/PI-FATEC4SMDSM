import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RecoverPasswordModule } from 'src/recover-password/recover-password.module';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RecoverEmailModule } from 'src/recover-email/recover-email.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    RecoverPasswordModule,
    EmailModule,
    RecoverEmailModule,
    PassportModule,
    SubscriptionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: "1d" }
    }),
  ],
  exports: [AuthService]
})
export class AuthModule { }
