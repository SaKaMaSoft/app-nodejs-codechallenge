import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { microserviceConfig } from './configs/microserviceConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3000,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI
  })
  app.connectMicroservice(microserviceConfig);
  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();