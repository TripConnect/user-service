"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = signIn;
exports.signUp = signUp;
exports.findUser = findUser;
exports.getUsers = getUsers;
exports.searchUser = searchUser;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const grpc = require('@grpc/grpc-js');
const user_1 = __importDefault(require("database/models/user"));
const user_credential_1 = __importDefault(require("database/models/user_credential"));
const logging_1 = __importDefault(require("utils/logging"));
const jwt_1 = require("utils/jwt");
async function signIn(call, callback) {
    try {
        let { username, password } = call.request;
        let user = await user_1.default.findOne({ where: { username } });
        if (!user)
            throw new Error("User not found");
        let userCredential = await user_credential_1.default.findOne({ where: { user_id: user.id } });
        const isMatchedPassword = await bcrypt_1.default.compare(password, userCredential.credential);
        if (!isMatchedPassword)
            throw new Error("Password incorrect");
        let accessToken = (0, jwt_1.getAccessToken)(user);
        let refreshToken = "";
        let signInResponse = {
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
        };
        callback(null, signInResponse);
    }
    catch (err) {
        logging_1.default.error(err.message);
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: 'Authorization failed'
        });
    }
}
async function signUp(call, callback) {
    try {
        let { username, password, displayName, avatarURL } = call.request;
        let existUser = await user_1.default.findOne({ where: { username } });
        if (existUser) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Invalid argument provided'
            });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(12);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        let user = await user_1.default.create({
            id: (0, uuid_1.v4)(),
            username,
            display_name: displayName,
            avatar: avatarURL || null,
            created_at: new Date(),
            updated_at: new Date(),
        });
        let userCredential = await user_credential_1.default.create({
            user_id: user.id,
            credential: hashedPassword,
        });
        let accessToken = (0, jwt_1.getAccessToken)(user);
        let signUpResponse = {
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
    }
    catch (err) {
        logging_1.default.error(err.message);
        callback(err, null);
    }
}
async function findUser(call, callback) {
    try {
        let { userId } = call.request;
        let user = await user_1.default.findOne({ where: { id: userId } });
        if (!user) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'User not found'
            });
            return;
        }
        let userResponse = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            displayName: user.display_name,
        };
        callback(null, userResponse);
    }
    catch (error) {
        logging_1.default.error(error.message);
        callback(error, null);
    }
}
async function getUsers(call, callback) {
    try {
        let { userIds } = call.request;
        let users = await user_1.default.findAll({ where: { id: { [sequelize_1.Op.in]: userIds } } });
        let usersResponse = {
            users: users.map((user) => ({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                displayName: user.display_name,
            })),
        };
        callback(null, usersResponse);
    }
    catch (err) {
        logging_1.default.error(err.message);
        callback(err, null);
    }
}
async function searchUser(call, callback) {
    const DEFAULT_PAGE_SIZE = 100;
    const DEFAULT_PAGE_NUMBER = 1;
    let { term, pageNumber, pageSize } = call.request;
    pageNumber = pageNumber || DEFAULT_PAGE_NUMBER;
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    try {
        let users = await user_1.default.findAll({
            where: {
                display_name: { [sequelize_1.Op.like]: `%${term}%` }
            },
            limit: pageSize,
            offset: (pageNumber - 1) * pageSize,
        });
        let usersResponse = {
            users: users.map((user) => ({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                displayName: user.display_name,
            })),
        };
        callback(null, usersResponse);
    }
    catch (err) {
        logging_1.default.error(err.message);
        callback(err, null);
    }
}
//# sourceMappingURL=rpc.js.map