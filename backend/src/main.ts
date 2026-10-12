import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo padrão para todas as rotas da API
  app.setGlobalPrefix('api');

  // Permite requisições do Angular durante o desenvolvimento
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();