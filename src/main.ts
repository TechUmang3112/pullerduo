// Imports
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3002;

  app.enableCors();

  await app.listen(port);

  console.log('Server is started on port', port);
}
bootstrap();
