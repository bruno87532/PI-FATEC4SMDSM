import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    async verifyCode(data: { id: string, randomCode: string }): Promise<Record<string, string | number>> {
        const { id, randomCode } = data
        try {
            const user = await this.usersService.getUserById(id)
            
             if (user.isActivate) {
                throw new UnauthorizedException("User already verified")
            }
            if (randomCode !== user.randomCode) {
                throw new UnauthorizedException("Invalid code")
            }
            if (new Date().getTime() > user.randomCodeExpiration.getTime()) {
                await this.handleExpiredCode( { id, name: user.name, email: user.email } )
                throw new UnauthorizedException("Expired code")
            }

            await this.handleVerifiedCode(id)
            return { message: "Code verified successfully", statusCode: 200 }
        } catch (error) {
            console.error(`An error ocurred while checked the user code with id ${id}:`, error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while checked the user code with id")
        }
    }

    private async handleVerifiedCode(id: string) {
        const data = {isActivate: new Date()}
        this.usersService.updateUser(id, data)
    }

    private async handleExpiredCode(data: { id: string, name: string, email: string }): Promise<void> {
        try {
            const newRandomCode = this.usersService.generateRandomCode()
            const newRandomCodeExpiration = this.usersService.generateExpirationTime()
            const updateData = {
                randomCode: newRandomCode,
                randomCodeExpiration: newRandomCodeExpiration
            }
            await this.usersService.updateUser(data.id, updateData)
            await this.usersService.sendWelcomeEmail({ name: data.name, email: data.email, code: newRandomCode })
        } catch (error) {
            console.error(`An error ocurred while updating the user code with id ${data.id}:`, error)
            throw new InternalServerErrorException("An error ocurred while updating the user code with id")
        }
    }
}

