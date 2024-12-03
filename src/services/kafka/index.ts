import { Kafka, logLevel as KafkaLogLevel } from "kafkajs";

export default new Kafka({
    clientId: 'user-service',
    brokers: [`${process.env.KAFKA_ADDRESS || 'localhost'}:${process.env.KAFKA_PORT || 9092}`],
    logLevel: KafkaLogLevel.ERROR
});
