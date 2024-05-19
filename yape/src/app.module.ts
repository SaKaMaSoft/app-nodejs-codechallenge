import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaController } from './kafka/kafka.controller';
import { KafkaService } from './kafka/kafka.service';

@Module({
  imports: [],
  controllers: [AppController, KafkaController],
  providers: [AppService, KafkaService],
})
export class AppModule {}
