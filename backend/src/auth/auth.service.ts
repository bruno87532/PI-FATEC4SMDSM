import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmailService } from 'src/email/email.service';
import { RecoverService } from 'src/recover/recover.service';
import { RecoverDto } from './dto/recover.dto';
import { VerifyRecoverDto } from './dto/verify-recover.dto';
import { ChangeDto } from './dto/change.dto';
import { ResponseMessage, ResponseMessageIdUser } from './response-message.interface';
import { RecoverTypeEnum } from 'src/recover/enum/recover-type.enum';
import { NewPasswordDto } from './dto/new-password.dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly recoverService: RecoverService,
        private readonly jwtService: JwtService,
    ) { }

    // ---- Código da lógica de verificação de código de usuário ---- //

    async verifyCode(data: VerifyCodeDto): Promise<ResponseMessage> {
        const { randomCode } = data
        try {
            const user = await this.usersService.getUserById(data.idUser)

            if (user.isActivate) {
                throw new BadRequestException("User already verified")
            }
            if (randomCode !== user.randomCode) {
                throw new BadRequestException("Invalid code")
            }
            if (new Date().getTime() > user.randomCodeExpiration.getTime()) {
                await this.handleExpiredCode({ id: data.idUser, name: user.name, email: user.email })
                throw new BadRequestException("Expired code")
            }

            await this.handleVerifiedCode(data.idUser)
            return { message: "Code verified successfully", statusCode: 200 }
        } catch (error) {
            console.error("An error ocurred while checked the user:", error)
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
            console.error("An error ocurred while updating the user code:", error)
            throw new InternalServerErrorException("An error ocurred while updating the user code with id")
        }
    }

    // ---- Fim do código da lógica de verificação de usuário ---- //
    // ---- Início do código da lógica de nova senha de conta nova ---- //

    async newPassword(data: NewPasswordDto): Promise<ResponseMessage> {
        try {
            const user = await this.usersService.getUserById(data.idUser)
            if (data.randomCode !== user.randomCode) {
                throw new BadRequestException("Invalid randomCode")
            }
            if (!user.isActivate) {
                throw new BadRequestException("User is not activated")
            }

            await this.usersService.updateUser(data.idUser, { password: data.password })
            return { message: "User updated succesfully", statusCode: 200 }
        } catch (error) {
            console.error("An error ocurred while updating new password from user", error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while updating new password from user")
        }
    }

    // ---- Fim do código da lógica de nova senha de conta nova ---- //
    // ---- Código da lógica de enviar email para alterar senha/email ---- //

    async sendChangeEmail(data: RecoverDto): Promise<ResponseMessageIdUser> {
        try {
            const { email, type } = data

            const user = await this.usersService.getUserByEmail(email)
            if (!user.isActivate) {
                throw new UnauthorizedException("User is not verified")
            }
            await this.recoverService.deleteRecoverByIdUser(user.id)
            const recover = await this.recoverService.createRecover(user.id, type)

            const templates = {
                [RecoverTypeEnum.PASSWORD]: { template: "recover-password", subject: "Recuperação de senha" },
                [RecoverTypeEnum.EMAIL]: { template: "recover-email", subject: "Alterar email" }
            };
            const { template, subject } = templates[type];
            await this.emailService.sendEmail(
                {
                    to: email,
                    template,
                    subject,
                },
                {
                    code: recover.randomCode,
                    year: new Date().getFullYear().toString()
                }
            )
            return { message: "An email was sent", statusCode: 200, idUser: user.id }
        } catch (error) {
            console.error("An error ocurred while sendind the email: ", error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while sending the email")
        }
    }

    // ---- Fim do código da lógica de enviar email para alterar senha ---- //
    // ---- Início do código da lógica de verificar código de alterar senha ---- //

    async verifyRecover(data: VerifyRecoverDto): Promise<ResponseMessage> {
        try {
            const recover = await this.recoverService.getRecoverByRandomCode(data.randomCode)
            if (recover.userId !== data.idUser) {
                throw new BadRequestException("Invalid code")
            }
            if (recover.type !== data.type) {
                throw new BadRequestException("Invalid code type")
            }
            if (recover.isActivate) {
                throw new BadRequestException("randomCode already verified")
            }
            if (new Date().getTime() > recover.expiredCode.getTime()) {
                throw new BadRequestException("Expired code")
            }

            this.recoverService.updateRecoverById(recover.id, { isActivate: new Date() })
            return { message: "randomCode verified successfully", statusCode: 200 }
        } catch (error) {
            console.error("An error ocurrend while checked the randomCode")
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurrend while checked the randomCode")
        }
    }

    // ---- Fim do código da lógica de verificar código de alterar senha ---- //
    // ---- Início do código da lógica para alter senha do usuário ---- //

    async changeEmailOrPassword(data: ChangeDto): Promise<ResponseMessage> {
        try {
            const recover = await this.recoverService.getRecoverByIdUser(data.idUser)
            if (recover.type !== data.type) {
                throw new BadRequestException("Invalid code type")
            }
            if (!recover.isActivate) {
                throw new BadRequestException("Invalid recover")
            }

            await this.usersService.updateUser(data.idUser, { password: data.password })
            await this.recoverService.deleteRecoverByIdUser(data.idUser)

            return { message: "User updated successfully", statusCode: 200 }
        } catch (error) {
            console.error("An error ocurred while changing password of the user", error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while changing password of the user")
        }
    }

    // ---- Fim do código da lógica para alter senha do usuário ---- //
    // ---- Início do código da lógica de validar senha ---- //

    async validateLogin(email: string, password: string) {
        try {
            const user = await this.usersService.getUserByEmail(email)
            if (!user || !user.password) return null

            const isPasswordValid = compareSync(password, user.password)
            if (!isPasswordValid) return null

            return user
        } catch (error) {
            return null
        }
    }

    async createJwt(user: User) {
        const payload = { 
            sub: user.id,
            email: user.email
        }

        return {
            token: this.jwtService.sign(payload)
        }
    }

    // ---- Fim do código da lógica de validar senha ---- //
}

