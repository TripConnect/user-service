import 'dotenv/config';

import * as grpc from '@grpc/grpc-js';
import { Kafka, logLevel as KafkaLogLevel } from 'kafkajs';
import { ConfigHelper, KafkaListener } from 'common-utils';
import { UserServiceService } from "common-utils/protos/defs/user_service_grpc_pb";

import { userServiceImp } from 'grpc.server';
import { resolvers } from 'services/kafka/resolvers';
import logger from 'utils/logging';

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

    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
        if (err != null) {
            return logger.error(err);
        }
        logger.info(`gRPC listening on ${port}`);
    });
}

start();
