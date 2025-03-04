import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    async verifyCode(data: { id: string, name: string, email: string, randomCode: string } ) {
        const { id, name, email, randomCode } = data
        try {
            const user = await this.usersService.getUserById(id)

            if (new Date().getTime() > user.randomCodeExpiration.getTime()) {
                const newRandomCode = this.usersService.generateRandomCode()
                this.usersService.sendWelcomeEmail( { 
                    name,
                    email,
                    code: newRandomCode
                } )
                throw new UnauthorizedException("Expired code")
            }
            if (randomCode !== user.randomCode) {
                throw new UnauthorizedException("Invalid code")
            }

            return { message: "Code verified successfully", statusCode: 200 }
        } catch (error) {
            console.error(`An error ocurred while checked the user code with id ${id}:`, error)
            throw new InternalServerErrorException("An error ocurred while checked the user code with id")
        }
    }

}

