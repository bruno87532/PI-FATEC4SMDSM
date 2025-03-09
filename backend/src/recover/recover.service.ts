import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import { RecoverTypeEnum } from './enum/recover-type.enum';

@Injectable()
export class RecoverService {
  constructor(private readonly prismaService: PrismaService) { }

  // ---- Início do código da lógica de criar código de mudar email/senha ---- //

  async createRecover(idUser: string, type: RecoverTypeEnum) {
    try {
      const randomCode = this.generateRandomCode()
      const expirationTime = this.generateExpirationTime()
      const recover = await this.prismaService.recover.create({
        data: {
          randomCode,
          userId: idUser,
          expiredCode: expirationTime,
          type
        }
      })

      return recover
    } catch (error) {
      console.error(`An error ocurred whilte creating recover to user with the id ${idUser}`, error)
      throw new InternalServerErrorException("An error ocurred whilte creating recover")
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

  // ---- Fim do código da lógica de criar código de recuperar email/senha ---- //
  // ---- Início do código de obter recover pelo randomCode ---- //

  async getRecoverByRandomCode(randomCode: string) {
    try {
      const recover = await this.prismaService.recover.findUnique({ where: { randomCode } })
      if (!recover) {
        throw new NotFoundException("Invalid Code")
      }

      return recover
    } catch (error) {
      console.error("An error ocurrend while fetching recover", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurrend while fetching recover")
    }
  }

  // ---- Fim do código de obter recover pelo randomCode ---- //
  // ---- Início do código de obter o recover pelo idUser ---- //

  async getRecoverByIdUser(idUser: string) {
    try {
      const recover = await this.prismaService.recover.findUnique({ where: { userId: idUser } })
      if (!recover) {
        throw new NotFoundException("Nonexistent user or user don't have recover")
      }

      return recover
    } catch (error) {
      console.error(`An error ocurrend while fetching recover with id ${idUser}`, error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurrend while fetching recover")
    }
  }

  // ---- Fim do código de obter o recover pelo idUser ---- //
  // ---- Início do código de atualizar o recover pelo id ----//

  async updateRecoverById(id: string, data: { isActivate: Date; }) {
    try {
      const recover = await this.prismaService.recover.update({
        where: { id },
        data
      })

      return recover
    } catch (error) {
      console.error(`An error ocurrend while updating the recover with id ${id}`, error)
      throw new InternalServerErrorException(`An error ocurrend while updating the recover with id ${id}`)
    }
  }

  // ---- Fim do código de atualizar o recover pelo id ----//
  // --- Início do código de deletar o recover pelo idUser ----//

  async deleteRecoverByIdUser(idUser: string) {
    try {
      await this.prismaService.recover.deleteMany({ where: { userId: idUser } })
    } catch (error) {
      console.error(`An error ocurred while deleting recover from user with id ${idUser}`, error)
      throw new InternalServerErrorException("An error ocurred while deleting recover from user")
    }
  }

  // --- Fim do código de deletar o recover pelo idUser ----//
}
