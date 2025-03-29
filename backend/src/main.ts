import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000",
    methods: "GET, POST",
    allowedHeaders: "Content-Type"
  })
  app.use("/stripe/payment-successfully", bodyParser.raw({ type: "application/json" }))
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
