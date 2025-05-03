import { Controller, Get, Post, Patch, Body, Param, UsePipes, ClassSerializerInterceptor, UseInterceptors, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordIsEqualDto } from './dto/password-is-equal.dto';

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
    return await this.usersService.updateUser(req.user.userId, data)
  }

  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  @Post("/password-is-equal")
  async passwordIsEqual(@Request() req, @Body() data: PasswordIsEqualDto) {
    return await this.usersService.PasswordIsEqual(req.user.userId, data)
  }
}
