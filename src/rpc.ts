import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { Op } from 'sequelize';
const grpc = require('@grpc/grpc-js');

import User from './database/models/user';
import UserCredential from './database/models/user_credential';
import logger from './utils/logging';
import { getAccessToken } from './utils/jwt';
import { AuthPayload, UserInfo } from './utils/types';

export async function signIn(call: any, callback: any) {
    try {
        let { username, password } = call.request;
        let user = await User.findOne({ where: { username } });
        if (!user) throw new Error("User not found");

        let userCredential = await UserCredential.findOne({ where: { user_id: user.id } });
        const isMatchedPassword = await bcrypt.compare(password, userCredential.credential);
        if (!isMatchedPassword) throw new Error("Password incorrect");

        let accessToken = getAccessToken(user);
        let refreshToken = "";

        let signInResponse: AuthPayload = {
            userInfo: {
                id: user.id,
                username: user.username,
                displayName: user.display_name,
                avatar: user.avatar,
            },
            token: {
                accessToken,
                refreshToken,
            },
        }

        callback(null, signInResponse);
    } catch (err: any) {
        logger.error(err.message);
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: 'Authorization failed'
        });
    }
}

export async function signUp(call: any, callback: any) {
    try {
        let { username, password, displayName, avatarURL } = call.request;

        let existUser = await User.findOne({ where: { username } });
        if (existUser) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Invalid argument provided'
            });
            return;
        }

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

        let accessToken = getAccessToken(user);

        let signUpResponse: AuthPayload = {
            userInfo: {
                id: user.id,
                username: user.username,
                displayName: user.display_name,
                avatar: user.avatar,
            },
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

export async function findUser(call: any, callback: any) {
    try {
        let { userId } = call.request;
        let user = await User.findOne({ where: { id: userId } });
        if (!user) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'User not found'
            });
            return;
        }
        let userResponse: UserInfo = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            displayName: user.display_name,
        };
        callback(null, userResponse);
    } catch (error: any) {
        logger.error(error.message);
        callback(error, null);
    }

}

export async function getUsers(call: any, callback: any) {
    try {
        let { userIds } = call.request;
        let users = await User.findAll({ where: { id: { [Op.in]: userIds } } });
        let usersResponse: { users: UserInfo[] } = {
            users: users.map((user: any) => ({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                displayName: user.display_name,
            })),
        }
        callback(null, usersResponse);
    } catch (err: any) {
        logger.error(err.message);
        callback(err, null);
    }
}

export async function searchUser(call: any, callback: any) {
    const DEFAULT_PAGE_SIZE = 100;
    const DEFAULT_PAGE_NUMBER = 1;
    let { term, pageNumber, pageSize } = call.request;
    pageNumber = pageNumber || DEFAULT_PAGE_NUMBER;
    pageSize = pageSize || DEFAULT_PAGE_SIZE;

    try {
        let users = await User.findAll({
            where: {
                display_name: { [Op.like]: `%${term}%` }
            },
            limit: pageSize,
            offset: (pageNumber - 1) * pageSize,
        });

        let usersResponse: { users: UserInfo[] } = {
            users: users.map((user: any) => ({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                displayName: user.display_name,
            })),
        };

        callback(null, usersResponse);
    } catch (err: any) {
        logger.error(err.message);
        callback(err, null);
    }
}