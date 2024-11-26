import { EachMessagePayload, Kafka } from 'kafkajs';
import logger from '../utils/logging';

class KafkaService {
    private kafka: Kafka;

    constructor(brokers: string[]) {
        this.kafka = new Kafka({
            clientId: 'user-service',
            brokers,
        });
    }

    getProducer() {
        return this.kafka.producer();
    }

    getConsumer(groupId: string) {
        return this.kafka.consumer({ groupId });
    }
}

const kafkaService = new KafkaService(['localhost:9093']);
export default kafkaService;

export function KafkaConsumer(topic: string, groupId: string): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void {
        const originalMethod = descriptor.value;
        logger.debug({ mesasge: 'Kafka listen', topic, groupId });
        descriptor.value = async function (...args: any[]) {
            const consumer = kafkaService.getConsumer(groupId);
            await consumer.connect();
            await consumer.subscribe({ topics: [topic], fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const value = message.value?.toString();
                    console.log(`Received message: ${value} from ${topic}`);
                    await originalMethod.call(this, value, ...args);
                },
            });
        };
    };
}
