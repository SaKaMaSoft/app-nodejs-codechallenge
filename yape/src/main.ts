import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { microserviceConfig } from './configs/microserviceConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceTcp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3000,
    },
  });
  app.connectMicroservice(microserviceConfig);
  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();