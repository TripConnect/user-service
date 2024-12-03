import 'dotenv/config';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

import logger from 'utils/logging';
import * as rpcImplementations from 'rpc';
import kafkaListener from 'services/kafka/listener';

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
    const server = new grpc.Server();
    server.addService(backendProto.User.service, rpcImplementations);
    kafkaListener.listen();
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
        if (err != null) {
            return logger.error(err);
        }
        logger.info(`gRPC listening on ${port}`);
    });
}

start();
