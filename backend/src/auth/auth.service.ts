import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmailService } from 'src/email/email.service';
import { RecoverPasswordsService } from 'src/recover-passwords/recover-passwords.service';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { VerifyRecoverPasswordDto } from './dto/verify-recover-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseMessage } from './response-message.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly recoverPasswordsService: RecoverPasswordsService,
    ) { }

    // ---- Código da lógica de verificação de código de usuário ---- //

    async verifyCode(data: VerifyCodeDto): Promise<ResponseMessage> {
        const { randomCode } = data
        try {
            const user = await this.usersService.getUserById(data.id)

            if (user.isActivate) {
                throw new BadRequestException("User already verified")
            }
            if (randomCode !== user.randomCode) {
                throw new BadRequestException("Invalid code")
            }
            if (new Date().getTime() > user.randomCodeExpiration.getTime()) {
                await this.handleExpiredCode({ id: data.id, name: user.name, email: user.email })
                throw new BadRequestException("Expired code")
            }

            await this.handleVerifiedCode(data.id)
            return { message: "Code verified successfully", statusCode: 200 }
        } catch (error) {
            console.error(`An error ocurred while checked the user code with id ${data.id}:`, error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while checked the user code with id")
        }
    }

    private async handleVerifiedCode(id: string) {
        const data = { isActivate: new Date() }
        await this.usersService.updateUser(id, data)
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

    async sendPasswordChangeEmail(data: RecoverPasswordDto): Promise<ResponseMessage> {
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
        } catch (error) {
            console.error("An error ocurred while sendind the email: ", error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while sending the email")
        }
    }

    // ---- Fim do código da lógica de enviar email para alterar senha ---- //
    // ---- Início do código da lógica de verificar código de alterar senha ---- //

    async verifyRecoverPassword(data: VerifyRecoverPasswordDto): Promise<ResponseMessage> {
        try {
            const recoverPassword = await this.recoverPasswordsService.getRecoverPasswordByRandomCode(data.randomCode)
            if (recoverPassword.isActivate) {
                throw new BadRequestException("randomCode already verified")
            }
            if (new Date().getTime() > recoverPassword.expiredCode.getTime()) {
                throw new BadRequestException("Expired code")
            }            

            this.recoverPasswordsService.updateRecoverPasswordById(recoverPassword.id, { isActivate: new Date() })

            return { message: "randomCode verified successfully", statusCode: 200 }
        } catch (error) {
            console.error("An error ocurrend while checked the randomCode")
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurrend while checked the randomCode")
        }
    }

    // ---- Fim do código da lógica de verificar código de alterar senha ---- //
    // ---- Início do código da lógica para alter senha do usuário ---- //

    async changePassword(data: ChangePasswordDto): Promise<ResponseMessage> {
        try {
            const recoverPassword = await this.recoverPasswordsService.getRecoverPasswordByIdUser(data.id)
            if (!recoverPassword.isActivate) {
                throw new BadRequestException("Invalid recoverPassword")
            }

            await this.usersService.updateUser(data.id, { password: data.password })
            return { message: "User updated successfully", statusCode: 200 }
        } catch (error) {
            console.error(`An error ocurred while changing password of the user with id ${data.id}`, error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while changing password of the user")
        }
    }

    // ---- Fim do código da lógica para alter senha do usuário ---- //
}

