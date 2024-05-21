import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debit } from './others/debit.entity';
import { Credit } from './others/credit.entity';
import { Payment } from './payment/payment.entity';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { KafkaModule } from './kafka/kafka.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TransactionType } from './others/type.entity';
import { Status } from './others/status.entity';

@Module({
  // imports: [TypeOrmModule.forRoot({
  //   type: 'postgres',
  //   entities: [Payment, Debit, Credit],
  //   replication: {
  //     master: {
  //       host: '172.17.0.1',
  //       port: 5432,
  //       username: 'postgres',
  //       password: 'postgres',
  //       database: 'postgres',
  //     },
  //     slaves: [{
  //       host: '172.17.0.1',
  //       port: 5432,
  //       username: 'postgres',
  //       password: 'postgres',
  //       database: 'postgres',
  //     }]
  //   },
  // }),
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Debit, Credit, Payment, TransactionType, Status],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Payment, Credit, Debit]),
    KafkaModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  controllers: [AppController, PaymentController],
  providers: [AppService, PaymentService],
})
export class AppModule { }
