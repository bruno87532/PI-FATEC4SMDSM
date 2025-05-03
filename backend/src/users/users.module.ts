import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { RecoverModule } from 'src/recover/recover.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    RecoverModule,
    PrismaModule, 
    EmailModule, 
    forwardRef(() => AuthModule)
  ],
  exports: [UsersService]
})
export class UsersModule {}
