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
      entities: [Debit, Credit, Payment],
      synchronize: true,
    }),
  TypeOrmModule.forFeature([Payment]),
    KafkaModule,
  ],
  controllers: [AppController, PaymentController],
  providers: [AppService, PaymentService],
})
export class AppModule { }
