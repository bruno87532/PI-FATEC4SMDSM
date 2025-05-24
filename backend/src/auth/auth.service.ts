import { BadRequestException, HttpException, Injectable, NotFoundException, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmailService } from 'src/email/email.service';
import { RecoverPasswordService } from 'src/recover-password/recover-password.service';
import { RecoverDto } from './dto/recover.dto';
import { VerifyRecoverDto } from './dto/verify-recover.dto';
import { ChangeDto } from './dto/change.dto';
import { ResponseMessage, ResponseMessageIdUser } from './response-message.interface';
import { NewPasswordDto } from './dto/new-password.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { User } from './interfaces/user.interface';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { RecoverEmailService } from 'src/recover-email/recover-email.service';
import { VerifyRecoverEmailDto } from './dto/verify-recover-email.dto';
import { AlterPasswordDto } from './dto/alter-password-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly recoverPasswordService: RecoverPasswordService,
    private readonly jwtService: JwtService,
    private readonly subscriptionService: SubscriptionService,
    private readonly recoverEmailService: RecoverEmailService,
  ) { }

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
        await this.handleExpiredVerifyCode({ id: data.idUser, name: user.name, email: user.email })
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

  private async handleExpiredVerifyCode(data: { id: string, name: string, email: string }): Promise<void> {
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

  async newAccountCompleted(data: NewPasswordDto): Promise<ResponseMessage> {
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

  async sendChangePassword(data: RecoverDto): Promise<ResponseMessageIdUser> {
    try {
      const { email } = data

      const user = await this.usersService.getUserByEmail(email)
      if (!user.isActivate) {
        throw new UnauthorizedException("User is not verified")
      }
      await this.recoverPasswordService.deleteRecoverByIdUser(user.id)
      const recover = await this.recoverPasswordService.createRecover(user.id)

      await this.emailService.sendEmail(
        {
          to: email,
          template: "recover-password",
          subject: "Recuperação de senha",
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


  async verifyRecoverPassword(data: VerifyRecoverDto): Promise<ResponseMessage> {
    const { idUser, randomCode } = data
    try {
      const recover = await this.recoverPasswordService.getRecoverByRandomCode(randomCode)
      if (recover.userId !== idUser) {
        throw new BadRequestException("Invalid code")
      }
      if (recover.isActivate) {
        throw new BadRequestException("randomCode already verified")
      }
      if (new Date().getTime() > recover.expiredCode.getTime()) {
        const user = await this.usersService.getUserById(idUser)
        const email = user.email
        this.sendChangePassword({ email })
        throw new BadRequestException("Expired code")
      }

      this.recoverPasswordService.updateRecoverById(recover.id, { isActivate: new Date() })
      return { message: "randomCode verified successfully", statusCode: 200 }
    } catch (error) {
      console.error("An error ocurrend while checked the randomCode")
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurrend while checked the randomCode")
    }
  }

  async changePassword(data: ChangeDto): Promise<ResponseMessage> {
    try {
      const recover = await this.recoverPasswordService.getRecoverByIdUser(data.idUser)
      if (!recover.isActivate) {
        throw new BadRequestException("Invalid recover")
      }

      await this.usersService.updateUser(data.idUser, { password: data.password })
      await this.recoverPasswordService.deleteRecoverByIdUser(data.idUser)

      return { message: "User updated successfully", statusCode: 200 }
    } catch (error) {
      console.error("An error ocurred while changing password of the user", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while changing password of the user")
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);

      if (user && user.password && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user
        return result
      }

      return null
    } catch (error) {
      return null
    }
  }

  async login(@Request() req: Request & { user: User }, @Res({ passthrough: true }) res: Response): Promise<ResponseMessage> {
    const payload = await this.createPayload(req.user)
    const token = this.jwtService.sign(payload)

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24
    })  
    
    return { message: "Login successfully", statusCode: 200 }
  }

  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    console.log("aqui foi")
    
    return { message: "Logout successfully" }
  }

  private async createPayload(user: User) {
    let isAdvertiser = false
    try {
      const subscriptionActivate = await this.subscriptionService.getSubscriptionActiveByIdUser(user.id)
      isAdvertiser = true
    } catch (error) { }

    const allowedFields = ["id", "name"]
    const payload = Object.fromEntries(
      Object.entries(user).filter(([key, value]) => value !== undefined && allowedFields.includes(key))
    )

    payload["isAdvertiser"] = isAdvertiser
    return payload
  }

  async renewToken(idUser: string, @Res({ passthrough: true }) res: Response) {
    try {
      const user = await this.usersService.getUserById(idUser)
      const payload = await this.createPayload({ id: idUser, name: user.name })
      const token = this.jwtService.sign(payload)
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24
      })

      return { message: "token renewed", statusCode: 200 }
    } catch (error) {
      console.error("An error ocurred while renewing token", error)
      throw new InternalServerErrorException("An error ocurred while renewing token")
    }
  }

  async sendChangeEmail(data: RecoverDto, idUser: string) {
    try {
      const { email } = data

      try {
        const user = await this.usersService.getUserByEmail(email)
        if (user) throw new BadRequestException("Email already registered")
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error
        }
      }

      await this.recoverEmailService.deleteRecoverByIdUser(idUser)
      const recover = await this.recoverEmailService.createRecoverEmail(idUser, email)

      await this.emailService.sendEmail(
        {
          to: email,
          template: "recover-email",
          subject: "Recuperação de email",
        },
        {
          code: recover.randomCode,
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

  async verifyRecoverEmail(data: VerifyRecoverEmailDto, idUser: string): Promise<ResponseMessage> {
    const { randomCode } = data
    try {
      const recover = await this.recoverEmailService.getRecoverEmailByRandomCode(randomCode)
      if (new Date().getTime() > recover.expiredCode.getTime()) {
        const user = await this.usersService.getUserById(idUser)
        const email = recover.newEmail
        this.sendChangeEmail({ email }, idUser)
        throw new BadRequestException("Expired code")
      }

      await this.usersService.updateUser(idUser, { email: recover.newEmail })
      await this.recoverEmailService.deleteRecoverByIdUser(idUser)
      return { message: "randomCode verified successfully", statusCode: 200 }
    } catch (error) {
      console.error("An error ocurrend while checked the randomCode")
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurrend while checked the randomCode")
    }
  }

  async alterPassword(data: AlterPasswordDto, idUser: string) {
    try {
      const isEqual = await this.usersService.passwordIsEqual(idUser, data.oldPassword)
      const newData = {
        password: data.newPassword
      }
      if (isEqual) {
        await this.usersService.updateUser(idUser, newData)
        return { message: "Password updated successfully" }
      }
      throw new BadRequestException("Passwords are different")
    } catch (error) {
      console.error("An error ocurred while checking the password for updating", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while checking the password for updating")
    }
  }
}  
