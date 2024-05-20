import { KafkaOptions, Transport } from "@nestjs/microservices";

export const microserviceConfig: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            brokers: ["172.17.0.1:9092"],
        },
        consumer: {
            groupId: 'my-group-1',
        },
    }
};