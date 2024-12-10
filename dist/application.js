"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const logging_1 = __importDefault(require("utils/logging"));
const rpcImplementations = __importStar(require("rpc"));
const listener_1 = __importDefault(require("services/kafka/listener"));
let packageDefinition = protoLoader.loadSync(require.resolve('common-utils/protos/backend.proto'), {
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
    listener_1.default.listen();
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err != null) {
            return logging_1.default.error(err);
        }
        logging_1.default.info(`gRPC listening on ${port}`);
    });
}
start();
//# sourceMappingURL=application.js.map