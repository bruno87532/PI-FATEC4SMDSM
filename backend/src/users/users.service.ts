import { Injectable, InternalServerErrorException, NotFoundException, HttpException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { randomInt } from 'crypto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

interface DataUpdateUser {
    password?: string;
    randomCode?: string;
    randomCodeExpiration?: Date;
    isActivate?: Date;
    typeUser?: "COMMON" | "ADVERTISER"
};

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService,
    ) { }

    // ---- Código para lógica de criar usuário ---- //

    async createUser(data: { name: string; email: string }): Promise<User> {
        try {
            const randomCode: string = this.generateRandomCode()
            const randomCodeExpiration: Date = this.generateExpirationTime()
            const user = await this.prismaService.user.create({
                data: { ...data, randomCode, randomCodeExpiration }
            })

            await this.sendWelcomeEmail({ name: data.name, email: data.email, code: randomCode })
            return user;
        } catch (error) {
            console.error("An error ocurred while creating the user:", error)
            if (error.code === "P2002") throw new BadRequestException("Email already registered") // Code que retorna pelo supabase quando dado já existe
            throw new InternalServerErrorException("An error ocurred while creating the user")
        }
    }

    generateRandomCode(): string {
        return randomInt(100000, 1000000).toString()
    }

    generateExpirationTime(): Date {
        const expirationTime: Date = new Date()
        expirationTime.setMinutes(expirationTime.getMinutes() + 5)
        return expirationTime
    }

    async sendWelcomeEmail(data: { name: string, email: string, code: string }): Promise<void> {
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

    // ---- Fim do código da lógica de criar usuário ---- //
    // ---- Código para obter usuário por id ---- //

    async getUserById(id: string) {
        try {
            const user = await this.prismaService.user.findUnique({ where: { id } })
            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`)
            }

            return user
        } catch (error) {
            console.error(`An error ocurred while fetching the user with id ${id}:`, error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while fetching the user")
        }
    }

    // ---- Fim do código que obtém o usuário por id ---- //
    // ---- Código para obter usuário por email ---- //
    
    async getUserByEmail(email: string) {
        try {
            const user = await this.prismaService.user.findUnique({ where: { email } })
            if (!user) {
                throw new NotFoundException("User not found")
            }
            return user
        } catch (error) {
            console.error("An error ocurred while fetching the user by email", error)
            if (error instanceof HttpException) throw error
            throw new InternalServerErrorException("An error ocurred while fetching the user by email") 
        }
    }

    // ---- Fim do código que obtém o usuário por email ---- //
    // ---- Código da lógica de atualização de usuário ---- //

    async updateUser(id: string, data: DataUpdateUser) {
        try {
            const dataUpdated = this.workflowTransformer(data);
            const newObject = Object.entries(dataUpdated)
                .filter(([key, value]) => value !== undefined)
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});
            const user = await this.prismaService.user.update({
                where: { id },
                data: newObject
            })
            return user
        } catch (error) {
            console.error("An error ocurred while updating the user:", error)
            throw new InternalServerErrorException("An error ocurred while updating the user")
        }
    }

    private workflowTransformer(data: DataUpdateUser) {
        const password = this.hashPassowrd(data.password ? data.password : undefined)
        const dataUpdated = {
            password,
            ...Object.fromEntries(
                Object.entries(data).filter(
                    ([key]) => key !== "password"
                )
            )
        }
        return dataUpdated
    }

    private hashPassowrd(password: string | undefined): string | undefined {
        if (password) {
            password = bcrypt.hashSync(password, 10)
        }
        return password
    }

    // ---- Fim do código da lógica de atualização de usuário ---- //

}
