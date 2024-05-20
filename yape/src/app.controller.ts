import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { Client, ClientKafka, EventPattern } from '@nestjs/microservices'
import { microserviceConfig } from './configs/microserviceConfig';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) { }

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
