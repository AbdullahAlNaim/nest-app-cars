import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
      cookieSession({
      keys: ['asdfasdf']
    })
  )
  
  app.enableCors({
    origin: '*',  // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  await app.listen(3000);
}
bootstrap();
