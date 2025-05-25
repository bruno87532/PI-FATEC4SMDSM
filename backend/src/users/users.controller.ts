import { Controller, Get, Post, Patch, Body, Param, UsePipes, ClassSerializerInterceptor, UseInterceptors, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { HaveUserWithAdvertiserNameDto } from './dto/have-user-with-advertiser-name.dto';
import { EmailIsEqualDto } from './dto/email-is-equal.dto';
import { getAdvertiserNameByIdsDto } from './dto/get-advertiser-name-by-ids.dto';
import { UserNameResponseDto } from './dto/user-name-response.dto';
import { ConfirmationNumberDto } from './dto/confirmation-number.dto';
import { VerifyNumberDto } from './dto/verify-number.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getUserById(@Request() req) {
    return plainToInstance(UserResponseDto, await this.usersService.getUserById(req.user.userId))
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    return plainToInstance(UserResponseDto, await this.usersService.createUser(data))
  }

  @Patch()
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateUser(@Request() req, @Body() data: UpdateUserDto) {
    return plainToInstance(UserResponseDto, await this.usersService.updateUser(req.user.userId, data))
  }

  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  @Post("/email-is-equal")
  async emailIsEqual(@Request() req, @Body() data: EmailIsEqualDto) {
    return await this.usersService.emailIsEqual(req.user.userId, data)
  }

  @Post("/have-user-with-advertiser-name")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async haveUserWithAdvertiserName(@Body() data: HaveUserWithAdvertiserNameDto) {
    return await this.usersService.haveUserWithAdvertiserName(data)
  }

  @Post("/get-advertiser-names-by-ids")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getAdvertiserNamesByIds(@Body() data: getAdvertiserNameByIdsDto) {
    return plainToInstance(UserNameResponseDto, await this.usersService.getAdvertiserNameByIds(data), { excludeExtraneousValues: true })
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("/confirmation-number")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async confirmationNumber(@Body() data: ConfirmationNumberDto, @Request() req) {
    return await this.usersService.confirmationNumber(data, req.user.userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("/verify-number")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async verifyNumber(@Body() data: VerifyNumberDto, @Request() req) {
    return await this.usersService.verifyNumber(data, req.user.userId)
  }
}
