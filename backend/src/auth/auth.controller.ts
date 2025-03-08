import { Controller, Body, UsePipes, ValidationPipe, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto'
import { HttpCode } from '@nestjs/common';
import { VerifyRecoverPasswordDto } from './dto/verify-recover-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/verify-code")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async verifyCode(@Body() data: VerifyCodeDto) {
        return await this.authService.verifyCode(data)
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
        return await this.authService.verifyRecoverPassword(data)
    }

    @Post("/change-password")
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async changePassword(@Body() data: ChangePasswordDto) {
        return await this.authService.changePassword(data)
    }
}

