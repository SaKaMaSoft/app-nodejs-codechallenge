import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { partition } from 'rxjs';

@Injectable()
export class KafkaService {
    private kafka: Kafka

    constructor() {
        this.kafka = new Kafka({
            clientId: 'my-app-1',
            brokers: ['172.17.0.1:9092'],
        });
    }
    /**
     * Send Message to an specific Kafka Topic
     * @param topic Topic name 
     * @param message Message to be send
     */
    async sendMessage(topic: string, message: string): Promise<void> {
        const producer = this.kafka.producer();
        message = message.concat(' ', new Date().toString());
        await producer.connect();
        await producer.send({
            topic,
            messages: [{ value: message }]
        });
        console.log('Message Sent');
        await producer.disconnect();
    }

    async consumeMessage(topic: string): Promise<void> {
        console.log('Starting consumer');
        const consumer = this.kafka.consumer({ groupId: 'my-group-1' });
        await consumer.connect();
        await consumer.subscribe({ topic });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({ value: message.value.toString() });
            },
        });
    }
}
