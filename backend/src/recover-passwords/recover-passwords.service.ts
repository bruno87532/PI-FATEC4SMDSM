import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RecoverPasswordsService {
  constructor(private readonly prismaService: PrismaService) { }

  // ---- Início do código da lógica de criar código de recuperar senha ---- //

  async createRecoverPassword(idUser: string) {
    try {
      const randomCode = this.generateRandomCode()
      const recoverPassword = await this.prismaService.recoverPassword.create({
        data: {
          randomCode,
          userId: idUser,
        }
      })

      return recoverPassword
    } catch (error) {
      console.error(`An error ocurred whilte creating recovery password to user with the id ${idUser}`, error)
      throw new InternalServerErrorException("An error ocurred whilte creating recovery password")
    }
  }

  private generateRandomCode() {
    return randomInt(100000, 1000000).toString()
  }

  // ---- Início do código da lógica de criar código de recuperar senha ---- //

  async getRecoverPasswordByRandomCode(randomCode: string) {
    try {
      const recoverPassword = await this.prismaService.recoverPassword.findUnique({ where: { randomCode } })
      if (!recoverPassword) {
        throw new NotFoundException("recoverPassword not found")
      }

      return recoverPassword
    } catch (error) {
      console.error("An error ocurrend while fetching recoverPassword", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurrend while fetching recoverPassword")
    }
  }

  async updateRecoverPasswordById(data: { date: Date; id: string; }) {
    try {
      const recoverPassword = await this.prismaService.recoverPassword.update({
        where: { id: data.id },
        data: {
          isActivate: data.date
        }
      })

      return recoverPassword
    } catch (error) {
      console.error(`An error ocurrend while updating the recoverPassword with id ${data.id}`, error)
      throw new InternalServerErrorException(`An error ocurrend while updating the recoverPassword with id ${data.id}`)
    }
  }
}
