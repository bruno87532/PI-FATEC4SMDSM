import { Controller, Post, Body, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/verify-code")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    @HttpCode(200)
    async verifyCode(@Body() data: VerifyCodeDto) {
        return await this.authService.verifyCode(data)
    }

}

