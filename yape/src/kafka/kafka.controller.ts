import { Controller, Get } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
    constructor(private kafkaService: KafkaService) { }

    /**
     * Testing Only: Endpoint that allowed to post a message on Kafka
     * @returns Response body sent to client 
     */
    @Get('send-message')
    async sendMessage(): Promise<string> {
        await this.kafkaService.sendMessage('test.topic', 'hello kafka');
        return 'Message sent!';
    }

    /**
     * Testing Only: Endpoint that allowed to start a consumer on Kafka
     * @returns Response body sent to client 
     */
    @Get('consume-message')
    async consumeMessage(): Promise<string> {
        await this.kafkaService.consumeMessage('test.topic');
        return 'Message consumed!';
    }
}
