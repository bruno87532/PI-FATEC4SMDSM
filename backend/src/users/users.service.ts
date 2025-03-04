import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { randomInt } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService
    ) { }

    async createUser(data: { name: string; email: string }): Promise<User> {
        try {
            const randomCode: string = this.generateRandomCode()
            const randomCodeExpiration: Date = this.generateExpirationTime()
            const user = await this.prismaService.user.create({
                data: { ...data, randomCode, randomCodeExpiration }
            })

            await this.sendWelcomeEmail( { name: data.name, email: data.email, code: randomCode } )
            return user;
        } catch (error) {
            console.error("An error ocurred while creating the user: " + error)
            throw new InternalServerErrorException("An error ocurred while creating the user")
        }
    }

    public generateRandomCode(): string {
        return randomInt(100000, 1000000).toString()
    }

    public generateExpirationTime(): Date {
        const expirationTime: Date = new Date()
        expirationTime.setHours(expirationTime.getHours() + 1)
        return expirationTime
    }

    public async sendWelcomeEmail(data: { name: string, email: string, code: string } ): Promise<void> {
        const { name, email, code } = data
        return this.emailService.sendEmail(
            {
                to: email,
                subject: "Código para a criação de conta",
                template: "welcome-code"
            },
            {
                name,
                code,
                year: new Date().getFullYear().toString()
            }
        )
    }

    async getUserById(id: string) {
        try {
            const user = await this.prismaService.user.findUnique({ where: { id } })
            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`)
            }

            return user
        } catch (error) {
            console.error(`An error ocurred while fetching the user with id ${id}:`, error)
            throw new InternalServerErrorException("An error ocurred while fetching the user")
        }
    }
}
