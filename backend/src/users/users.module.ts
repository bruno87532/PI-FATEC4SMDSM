import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { EvolutionModule } from 'src/evolution/evolution.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    PrismaModule, 
    EmailModule, 
    EvolutionModule,
    forwardRef(() => AuthModule)
  ],
  exports: [UsersService]
})
export class UsersModule {}
