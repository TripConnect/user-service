import 'dotenv/config';

import * as grpc from '@grpc/grpc-js';
import { Kafka, logLevel as KafkaLogLevel } from 'kafkajs';
import { ConfigHelper, KafkaListener } from 'common-utils';

import { userServiceImp } from 'rpc';
import { resolvers } from 'services/kafka/resolvers';
import logger from 'utils/logging';
import { UserServiceService } from "node-proto-lib/protos/user_service_grpc_pb";

function start() {
    const PORT = ConfigHelper.read("server.port");

    const kafkaInstance = new Kafka({
        clientId: process.env.SERVICE_NAME,
        brokers: [`${ConfigHelper.read("kafka.host")}:${ConfigHelper.read("kafka.port")}`],
        logLevel: KafkaLogLevel.ERROR
    });
    const kafkaListener = new KafkaListener(kafkaInstance, resolvers);
    kafkaListener.listen();

    const server = new grpc.Server();
    server.addService(UserServiceService, userServiceImp);

    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err != null) {
            return logger.error(err);
        }
        logger.info(`gRPC listening on ${port}`);
    });
}

start();
