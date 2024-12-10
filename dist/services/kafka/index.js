"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
exports.default = new kafkajs_1.Kafka({
    clientId: 'user-service',
    brokers: [`${process.env.KAFKA_ADDRESS || 'localhost'}:${process.env.KAFKA_PORT || 9092}`],
    logLevel: kafkajs_1.logLevel.ERROR
});
//# sourceMappingURL=index.js.map