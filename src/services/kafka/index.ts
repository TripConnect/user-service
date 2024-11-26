import { Kafka, logLevel as KafkaLogLevel, Producer } from "kafkajs";

export default new Kafka({
    clientId: 'user-service',
    brokers: ['localhost:9092'],
    logLevel: KafkaLogLevel.ERROR
});
