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
        try {
            const producer = this.kafka.producer();
            await producer.connect();
            await producer.send({
                topic,
                messages: [{ value: message }]
            });

            // TODO: Log to be changed to observability library.
            console.log('Message Sent');
            await producer.disconnect();
        } catch (error) {
            console.log(error);
        }
    }

    async consumeMessage(topic: string): Promise<void> {
        // TODO: Log to be changed to observability library.
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
