import 'dotenv/config';
const fs = require('fs');
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

import User from './database/models/user';
import UserCredential from './database/models/user_credential';

import logger from './utils/logging';

let packageDefinition = protoLoader.loadSync(
    process.env.PROTO_URL,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
let backendProto = grpc.loadPackageDefinition(packageDefinition).backend;

type Token = {
    accessToken: string;
    refreshToken: string;
}

type AuthPayload = {
    id: string;
    avatar: string | null;
    username: string;
    displayName: string;
    token: Token;
}

async function signIn(call: any, callback: any) {
    try {
        let { username, password } = call.request;
        let user = await User.findOne({ where: { username } });
        if (!user) throw new Error("Authorization failed");

        let userCredential = await UserCredential.findOne({ where: { user_id: user.id } });
        const isMatchedPassword = await bcrypt.compare(password, userCredential.credential);
        if (!isMatchedPassword) throw new Error("Authorization failed");

        let accessToken = jwt.sign(
            {
                user_id: user.id,
                username: user.username,
                credential: userCredential.credential,
            },
            process.env.JWT_SECRET_KEY || ""
        );
        let refreshToken = "";

        let signInResponse: AuthPayload = {
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
    } catch (err: any) {
        logger.error(err.message);
        callback(err, null);
    }
}

async function signUp(call: any, callback: any) {
    try {
        let { username, password, displayName, avatarURL } = call.request;
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.create({
            id: uuidv4(),
            username,
            display_name: displayName,
            avatar: avatarURL || null,
            created_at: new Date(),
            updated_at: new Date(),
        });

        let userCredential = await UserCredential.create({
            user_id: user.id,
            credential: hashedPassword,
        });

        let accessToken = jwt.sign(
            {
                user_id: user.id,
                username: user.username,
                credential: userCredential.credential,
            },
            process.env.JWT_SECRET_KEY || ""
        );

        let signUpResponse: AuthPayload = {
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            avatar: user.avatar,
            token: {
                accessToken,
                refreshToken: "",
            },
        };

        callback(null, signUpResponse);
    } catch (err: any) {
        logger.error(err.message);
        callback(err, null);
    }
}

const PORT = process.env.USER_SERVICE_PORT || 3107;

function start() {
    let server = new grpc.Server();
    server.addService(backendProto.User.service, { signIn: signIn, signUp: signUp });
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
        if (err != null) {
            return console.error(err);
        }
        console.log(`gRPC listening on ${port}`)
    });
}

start();
