import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: 'http://localhost:5173', // Permite peticiones desde el frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si se manda algo que no esté permitido
      transform: true, // Convierte tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos según el DTO (string -> number)
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
