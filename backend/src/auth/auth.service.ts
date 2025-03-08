import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmailService } from 'src/email/email.service';
import { RecoverPasswordsService } from 'src/recover-passwords/recover-passwords.service';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { VerifyRecoverPasswordDto } from './dto/verify-recover-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly recoverPasswordsService: RecoverPasswordsService,
    ) { }

    // ---- Código da lógica de verificação de código de usuário ---- //

    async verifyCode(id: string, data: VerifyCodeDto): Promise<Record<string, string | number>> {
        const { randomCode } = data
        try {
            const user = await this.usersService.getUserById(id)

            if (user.isActivate) {
                throw new UnauthorizedException("User already verified")
            }
            if (randomCode !== user.randomCode) {
                throw new UnauthorizedException("Invalid code")
            }
            if (new Date().getTime() > user.randomCodeExpiration.getTime()) {
                await this.handleExpiredCode({ id, name: user.name, email: user.email })
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
        const data = { isActivate: new Date() }
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

    // ---- Fim do código da lógica de verificação de usuário ---- //
    // ---- Código da lógica de enviar email para alterar senha ---- //

    async sendPasswordChangeEmail(data: RecoverPasswordDto) {
        try {
            const { email } = data
            const user = await this.usersService.getUserByEmail(email)
            const recoverPassword = await this.recoverPasswordsService.createRecoverPassword(user.id)

            await this.emailService.sendEmail(
                {
                    to: email,
                    template: "recover-password",
                    subject: "Recuperação de senha"
                },
                { 
                    code: recoverPassword.randomCode,
                    year: new Date().getFullYear().toString()
                }
            )
            return { message: "An email was sent", statusCode: 200 }
        } catch(error) {
            console.error("An error ocurred while sendind the email: ", error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while sending the email")
        }
    }

    // ---- Fim do código da lógica de enviar email para alterar senha ---- //
    // ---- Início do código da lógica de verificar código de alterar senha ---- //

    async verifyRecoverPassword(data: VerifyRecoverPasswordDto) {
        try {
            const recoverPassword = await this.recoverPasswordsService.getRecoverPasswordByRandomCode(data.randomCode)
            if (recoverPassword.isActivate) {
                throw new UnauthorizedException("User already verified")
            }

            this.recoverPasswordsService.updateRecoverPasswordById({ 
                id: recoverPassword.id, date: new Date() 
            })

            return recoverPassword
        } catch(error) {
            console.error("An error ocurrend while checked the randomCode")
            if (error instanceof HttpException) throw new NotFoundException("Invalid code")
            throw new InternalServerErrorException("An error ocurrend while checked the randomCode")
        }
    }

    // ---- Fim do código da lógica de verificar código de alterar senha ---- //
}

