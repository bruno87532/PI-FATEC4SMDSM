import { Controller, Body, UsePipes, ValidationPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RecoverDto } from './dto/recover.dto'
import { HttpCode } from '@nestjs/common';
import { VerifyRecoverDto } from './dto/verify-recover.dto';
import { ChangeDto } from './dto/change.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/verify-code")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async verifyCode(@Body() data: VerifyCodeDto) {
        return await this.authService.verifyCode(data)
    }

    @Post("/new-password")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async newPassword(@Body() data: NewPasswordDto) {
        return await this.authService.newPassword(data)
    }

    @Post("/recover")
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async recoverPassword(@Body() data: RecoverDto) {
        return await this.authService.sendChangeEmail(data)
    }

    @Post("/verify-recover")
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async verifyRecoverPassword(@Body() data: VerifyRecoverDto) {
        return await this.authService.verifyRecover(data)
    }

    @Post("/change")
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async changePassword(@Body() data: ChangeDto) {
        return await this.authService.changeEmailOrPassword(data)
    }
}

