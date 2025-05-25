import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomInt } from 'crypto';
import { RecoverEmail } from '@prisma/client';

@Injectable()
export class RecoverEmailService {
  constructor(private readonly prismaService: PrismaService) { }

  async createRecoverEmail(idUser: string, email: string) {
    try {
      const randomCode = this.generateRandomCode().toString()
      const expiredCode = this.generateExpirationTime()

      const recoverEmail = await this.prismaService.recoverEmail.create({
        data: {
          userId: idUser,
          randomCode,
          expiredCode,
          newEmail: email
        }
      })

      return recoverEmail
    } catch (error) {
      console.error("An error ocurred while creating recoverEmail", error)
      throw new InternalServerErrorException("An error ocurred while creating recoverEmail")
    }
  }

  private generateRandomCode() {
    return randomInt(100000, 1000000)
  }

  private generateExpirationTime() {
    const expirationTime = new Date()
    expirationTime.setMinutes(expirationTime.getMinutes() + 5)
    return expirationTime
  }

  async deleteRecoverByIdUser(idUser: string) {
    try {
      const recover = await this.prismaService.recoverEmail.deleteMany({ where: { userId: idUser } })
    } catch (error) {
      console.error("An error ocurred while deleting recover", error)
      throw new InternalServerErrorException("An error ocurred while deleting recover")
    }
  }

  async getRecoverEmailByRandomCode(randomCode: string): Promise<RecoverEmail> {
    try {
      const recoverEmail = await this.prismaService.recoverEmail.findUnique({ where: { randomCode } })

      if (!recoverEmail) throw new NotFoundException("Recover email not found")

      return recoverEmail
    } catch (error) {
      console.error("An error ocurred while fetching recoverEmail by randomCode")
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while fetching recoverEmail by randomCode")
    }
  }
}
