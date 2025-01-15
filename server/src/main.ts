import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200', // Angular
      'http://localhost:5173', // Vite
      'http://dev-retail-app-front.us-east-1.elasticbeanstalk.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: false,
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
  });

  const config = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('products')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
