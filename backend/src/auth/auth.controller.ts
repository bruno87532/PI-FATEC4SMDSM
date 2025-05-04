import { Controller, Body, UsePipes, ValidationPipe, Post, HttpStatus, Res, Request, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RecoverDto } from './dto/recover.dto'
import { HttpCode } from '@nestjs/common';
import { VerifyRecoverDto } from './dto/verify-recover.dto';
import { ChangeDto } from './dto/change.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './interfaces/user.interface';
import { Response } from 'express';
import { VerifyRecoverEmailDto } from './dto/verify-recover-email.dto';
import { AlterPasswordDto } from './dto/alter-password-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Patch("/alter-password")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async alterPassword(@Body() data: AlterPasswordDto, @Request() req) {
    return await this.authService.alterPassword(data, req.user.userId)
  }

  @Post("/verify-code")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async verifyCode(@Body() data: VerifyCodeDto) {
    return await this.authService.verifyCode(data)
  }

  @Post("/new-password")
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async newAccountCompleted(@Body() data: NewPasswordDto) {
    return await this.authService.newAccountCompleted(data)
  }

  @Post("/recover-password")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async recoverPassword(@Body() data: RecoverDto) {
    return await this.authService.sendChangePassword(data)
  }

  @Post("/recover-email")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async recoverEmail(@Body() data: RecoverDto, @Request() req) {
    return await this.authService.sendChangeEmail(data, req.user.userId)
  }

  @Post("/verify-recover-password")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async verifyRecoverPassword(@Body() data: VerifyRecoverDto) {
    return await this.authService.verifyRecoverPassword(data)
  }

  @Post("/verify-recover-email")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async verifyRecoverEmail(@Body() data: VerifyRecoverEmailDto, @Request() req) {
    return await this.authService.verifyRecoverEmail(data, req.user.userId)
  }

  @Post("/change-password")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async changePassword(@Body() data: ChangeDto) {
    return await this.authService.changePassword(data)
  }

  @HttpCode(200)
  @UseGuards(AuthGuard("local"))
  @Post("/login")
  async login(@Request() req: Request & { user: User }, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req, res)
  }

  @Get("/me")
  @UseGuards(AuthGuard("jwt"))
  async isAuthenticated() {
    return { authenticated: true }
  }

}

