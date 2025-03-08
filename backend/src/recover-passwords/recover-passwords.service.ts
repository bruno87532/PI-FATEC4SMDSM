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
      const expirationTime = this.generateExpirationTime()
      const recoverPassword = await this.prismaService.recoverPassword.create({
        data: {
          randomCode,
          userId: idUser,
          expiredCode: expirationTime
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

  private generateExpirationTime() {
    const expirationTime = new Date()
    expirationTime.setMinutes(expirationTime.getMinutes() + 5)
    return expirationTime
  }

  // ---- Fim do código da lógica de criar código de recuperar senha ---- //
  // ---- Início do código de obter recoverPassword pelo randomCode ---- //

  async getRecoverPasswordByRandomCode(randomCode: string) {
    try {
      const recoverPassword = await this.prismaService.recoverPassword.findUnique({ where: { randomCode } })
      if (!recoverPassword) {
        throw new NotFoundException("Invalid Code")
      }

      return recoverPassword
    } catch (error) {
      console.error("An error ocurrend while fetching recoverPassword", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurrend while fetching recoverPassword")
    }
  }

  // ---- Início do código de obter o recoverPassword pelo idUser ---- //
  
  async getRecoverPasswordByIdUser(idUser: string) {
    try {
      const recoverPassword = await this.prismaService.recoverPassword.findUnique({ where: { userId: idUser } })
      if (!recoverPassword) {
        throw new NotFoundException("Nonexistent user or user don't have recoverPassword")
      }

      return recoverPassword
    } catch (error) {
      console.error(`An error ocurrend while fetching recoverPassword with id ${idUser}`, error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurrend while fetching recoverPassword")
    }
  }

  // ---- Fim do código de obter o recoverPassword pelo idUser ---- //

  // ---- Fim do código de obter recoverPassword pelo randomCode ---- //
  // ---- Início do código de atualizador recoverPassword pelo id ----//

  async updateRecoverPasswordById(id: string, data: { isActivate: Date; }) {
    try {
      const recoverPassword = await this.prismaService.recoverPassword.update({
        where: { id },
        data
      })

      return recoverPassword
    } catch (error) {
      console.error(`An error ocurrend while updating the recoverPassword with id ${id}`, error)
      throw new InternalServerErrorException(`An error ocurrend while updating the recoverPassword with id ${id}`)
    }
  }

  // ---- Fim do código de atualizador recoverPassword pelo id ----//

}
