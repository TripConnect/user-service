import 'dotenv/config';

const grpc = require('@grpc/grpc-js');

import { backendProto } from 'common-utils';
import * as rpcImplementations from 'rpc';
import kafkaListener from 'services/kafka/listener';
import logger from 'utils/logging';

const PORT = process.env.USER_SERVICE_PORT || 3107;

function start() {
    const server = new grpc.Server();
    server.addService(backendProto.user_service.User.service, rpcImplementations);
    kafkaListener.listen();
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
        if (err != null) {
            return logger.error(err);
        }
        logger.info(`gRPC listening on ${port}`);
    });
}

start();
