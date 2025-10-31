import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // IMPORTANT: Replace this with the actual URL your Next.js frontend is running on (e.g., 3000, 3001, or 8080)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip properties that do not have any decorators
      transform: true, // Automatically transform payload to DTO instance
    }),
  );


  app.setGlobalPrefix('api');


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
