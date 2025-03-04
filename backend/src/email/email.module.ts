import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      },
      defaults: {
        from: `${process.env.NAME_EMAIL} <${process.env.EMAIL}>`
      },
      template: {
        dir: join(__dirname, "/templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  ]
})
export class EmailModule {}
