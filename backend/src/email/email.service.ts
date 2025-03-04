import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(
        dataEmail: {
            to: string;
            subject: string;
            template: string;
        },
        context: Record<string, string>,
    ): Promise<void> {
        try {
            const { to, subject, template } = dataEmail
            this.mailerService.sendMail({
                to,
                subject,
                template,
                context
            })
        } catch (error) {
            console.error("An error ocurred while sending the email: " + error)
            throw new InternalServerErrorException("An error ocurred while sending the email")
        }
    }
}
