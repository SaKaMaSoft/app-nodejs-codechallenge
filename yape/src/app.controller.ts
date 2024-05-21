import { Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import Redis from 'ioredis';
import { AppService } from './app.service';
import { Client, ClientKafka, EventPattern } from '@nestjs/microservices'
import { microserviceConfig } from './configs/microserviceConfig';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED, TRANSACTION_TYPE_CROSS_BORDER, TRANSACTION_TYPE_DOMESTIC_TRANSFER } from './constants/status';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redis: Redis
  ) { }

  @Client(microserviceConfig)
  client: ClientKafka;

  onModuleInit() {
    const requestPatterns = [
      'test-topic',
    ];

    console.log('Starting Consumer');
    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Endpoint to initiliaze data stored in Redis.
   * @returns Return information created
   */
  @Post('redis')
  async setUpRedisData() {
    // TODO: Have to be changed in a different initialization, only for the challenge.
    console.log('Initialization of Redis Data');
    const status = [
      {
        id: STATUS_PENDING,
        name: 'PENDING'
      },
      {
        id: STATUS_APPROVED,
        name: 'APPROVED'
      },
      {
        id: STATUS_REJECTED,
        name: 'REJECTED'
      }
    ];
    const type = [
      {
        id: TRANSACTION_TYPE_DOMESTIC_TRANSFER,
        name: 'Domestic Transfer'
      },
      {
        id: TRANSACTION_TYPE_CROSS_BORDER,
        name: 'Cross Border'
      }
    ];
    await this.redis.set('status', JSON.stringify(status));
    await this.redis.set('type', JSON.stringify(type));
    const statuses = JSON.parse(await this.redis.get("status"));
    const transactionTypes = JSON.parse(await this.redis.get("type"));
    console.log(statuses, transactionTypes);
    return { statuses, transactionTypes };
  }

  @EventPattern('test-topic')
  async handleEntityCreated(payload: any) {
    // Variable to randomize and simulate Anti Fraud validation system.
    let random_boolean = Math.random() < 0.5;
    let status = 'REJECTED';
    const id = payload;
    if (random_boolean) {
      status = 'APPROVED';
    }

    // TODO: Log to be changed to observability library.
    console.log(id, status);

    // Once we the message we are calling our Payment PATCH endpoint to update transaction status.
    console.log(await this.appService.sendUpdate(id, status));
  }

}
