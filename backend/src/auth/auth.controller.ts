import { Controller, Patch, Body, UsePipes, ValidationPipe, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto'
import { HttpCode } from '@nestjs/common';
import { VerifyRecoverPasswordDto } from './dto/verify-recover-password.dto';
import { plainToInstance } from 'class-transformer';
import { VerifyRecoverPasswordResponseDto } from './dto/verify-recover-password-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Patch("/verify-code/:id")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async verifyCode(@Param("id") id: string, @Body() data: VerifyCodeDto) {
        return await this.authService.verifyCode(id, data)
    }

    @Post("/recover-password")
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async recoverPassword(@Body() data: RecoverPasswordDto) {
        return await this.authService.sendPasswordChangeEmail(data)
    }

    @Post("/verify-recover-password")
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async verifyRecoverPassword(@Body() data: VerifyRecoverPasswordDto) {
        return plainToInstance(VerifyRecoverPasswordResponseDto, await this.authService.verifyRecoverPassword(data))
    }
}

