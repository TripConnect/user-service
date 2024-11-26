import 'dotenv/config';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

import logger from './utils/logging';
import * as rpcImplementations from './rpc';
import { Consumer, ConsumerEachMessagePayload, Kafka, logLevel as KafkaLogLevel } from 'kafkajs';

let packageDefinition = protoLoader.loadSync(
    require.resolve('common-utils/protos/backend.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
let backendProto = grpc.loadPackageDefinition(packageDefinition).backend;

const PORT = process.env.USER_SERVICE_PORT || 3107;

function start() {
    let server = new grpc.Server();
    server.addService(backendProto.User.service, rpcImplementations);
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
        if (err != null) {
            return logger.error(err);
        }
        logger.info(`gRPC listening on ${port}`);
    });
}

// start();

(async function () {
    const kafka = new Kafka({
        clientId: 'user-service',
        brokers: ['localhost:9092'],
        logLevel: KafkaLogLevel.ERROR
    });

    const consumer: Consumer = kafka.consumer({ groupId: 'user-service-consumer' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'user-signout', fromBeginning: true });
    await consumer.run({
        eachMessage: async (payload: ConsumerEachMessagePayload) => {
            console.log('----------------------------------------------------');
            console.log(payload.message.value?.toString());
        },
    });
})();