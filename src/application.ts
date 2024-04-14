import 'dotenv/config';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

import User from './database/models/user';
import UserCredential from './database/models/user_credential';

import logger from './utils/logging';

const PROTO_PATH = 'src/protos/application.proto';
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
let user_proto = grpc.loadPackageDefinition(packageDefinition).user_service;

type Token = {
    accessToken: string;
    refreshToken: string;
}

type SignInResponse = {
    id: string;
    avatar: string;
    username: string;
    displayName: string;
    token: Token;
}

async function signIn(call: any, callback: any) {
    try {
        let { username, password } = call.request;
        let user = await User.findOne({ where: { username } });
        if (!user) throw new Error("Authorization failed");

        let userCredential = await UserCredential.findOne({ where: { id: user.id } });
        const isMatchedPassword = await bcrypt.compare(password, userCredential.credential);
        if (!isMatchedPassword) throw new Error("Authorization failed");

        let accessToken = jwt.sign(
            {
                user_id: user.id,
                username: user.username,
                credential: userCredential.credential,
            },
            process.env.SECRET_KEY || ""
        );
        let refreshToken = "";

        let signInResponse: SignInResponse = {
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            avatar: user.avatar,
            token: {
                accessToken,
                refreshToken,
            },
        }
        callback(null, signInResponse);
    } catch (err) {
        logger.error(err);
        callback(err, null);
    }
}

const PORT = process.env.USER_SERVICE_PORT || 3107;

function start() {
    var server = new grpc.Server();
    server.addService(user_proto.User.service, { signIn: signIn });
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
        if (err != null) {
            return console.error(err);
        }
        console.log(`gRPC listening on ${port}`)
    });
}

start();