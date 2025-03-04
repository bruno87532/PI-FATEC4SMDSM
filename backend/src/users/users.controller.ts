import { Controller, Get, Post, Patch, Delete, Body, Param, UsePipes, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id")
    async getUserById(@Param("id") id: string) {
        return plainToInstance(UserResponseDto, await this.usersService.getUserById(id))
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
        return plainToInstance(UserResponseDto, await this.usersService.createUser(data)) 
    }
}
