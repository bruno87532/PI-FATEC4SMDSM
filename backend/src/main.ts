import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.ORIGIN,
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type",
    credentials: true
  })
  app.use("/api/stripe/payment-successfully", bodyParser.raw({ type: "application/json" }))
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
