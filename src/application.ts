import 'dotenv/config';

const grpc = require('@grpc/grpc-js');
import { Kafka, logLevel as KafkaLogLevel } from 'kafkajs';
import { backendProto, ConfigHelper, KafkaListener } from 'common-utils';

import * as rpcImplementations from 'rpc';
import { resolvers } from 'services/kafka/resolvers';
import logger from 'utils/logging';

function start() {
    const PORT = ConfigHelper.read("server.port");

    const kafkaInstance = new Kafka({
        clientId: 'user-service',
        brokers: [`${ConfigHelper.read("kafka.host")}:${ConfigHelper.read("kafka.port")}`],
        logLevel: KafkaLogLevel.ERROR
    });
    const kafkaListener = new KafkaListener(kafkaInstance, resolvers);
    kafkaListener.listen();

    const server = new grpc.Server();
    server.addService(backendProto.user_service.UserService.service, rpcImplementations);
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
        if (err != null) {
            return logger.error(err);
        }
        logger.info(`gRPC listening on ${port}`);
    });
}

start();
