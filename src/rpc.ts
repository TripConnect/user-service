import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IUserServiceServer } from "node-proto-lib/protos/user_service_grpc_pb";
import { AuthenticatedInfo, FindUserRequest, GetUsersRequest, SearchUserRequest, SignInRequest, SignUpRequest, Token, UserInfo, UsersInfo } from "node-proto-lib/protos/user_service_pb";
import bcrypt from "bcryptjs";
import {ConfigHelper, TokenHelper} from "common-utils";
import { v4 as uuidv4 } from 'uuid';
import * as grpc from '@grpc/grpc-js';
import logger from "utils/logging";
import { Op } from "sequelize";
import userService from "./services/user";
import {userCredentialRepository, userRepository} from "./repository";

const DEFAULT_USER_AVATAR = ConfigHelper.read('default-avatar.user') as string;

export const userServiceImp: IUserServiceServer = {

    signIn: async function (
        call: ServerUnaryCall<SignInRequest, AuthenticatedInfo>,
        callback: sendUnaryData<AuthenticatedInfo>) {
        try {
            let { username, password } = call.request.toObject();
            let user = await userRepository.findOne({ where: { username } });
            if (!user) throw new Error("User not found");

            let userCredential = await userCredentialRepository.findOne({ where: { user_id: user.id } });
            if(!userCredential) throw new Error("User credential does not exist");

            const isMatchedPassword = await bcrypt.compare(password, userCredential.credential);
            if (!isMatchedPassword) throw new Error("Password incorrect");

            let accessToken = TokenHelper.sign({
                userId: user.id
            });
            let refreshToken = "";

            let token = new Token()
                .setAccessToken(accessToken)
                .setRefreshToken(refreshToken);

            let userInfo = new UserInfo()
                .setId(user.id)
                .setDisplayName(user.display_name)
                .setAvatar(user.avatar)
                .setEnabledTwofa(user.enabled_twofa)

            let signInResponse = new AuthenticatedInfo()
                .setUserInfo(userInfo)
                .setToken(token);

            callback(null, signInResponse);
        } catch (err: any) {
            logger.error(err.message);
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Authorization failed'
            });
        }
    },

    signUp: async function (
        call: ServerUnaryCall<SignUpRequest, AuthenticatedInfo>,
        callback: sendUnaryData<AuthenticatedInfo>) {
        try {
            let { username, password, displayName, avatarUrl } = call.request.toObject();

            let existUser = await userRepository.findOne({ where: { username } });
            if (existUser) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Invalid argument provided'
                });
                return;
            }

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            let user = await userRepository.create({
                id: uuidv4(),
                username,
                display_name: displayName,
                avatar: avatarUrl || DEFAULT_USER_AVATAR,
                created_at: new Date(),
                updated_at: new Date(),
            });

            await userCredentialRepository.create({
                user_id: user.id,
                credential: hashedPassword,
            });

            let accessToken = TokenHelper.sign({
                userId: user.id
            });

            let userInfo = new UserInfo()
                .setId(user.id)
                .setDisplayName(user.display_name)
                .setAvatar(user.avatar)
                .setEnabledTwofa(user.enabled_twofa)

            let token = new Token()
                .setAccessToken(accessToken)
                .setRefreshToken("")

            let signUpResponse = new AuthenticatedInfo()
                .setUserInfo(userInfo)
                .setToken(token);

            callback(null, signUpResponse);
        } catch (err: any) {
            logger.error(err.message);
            callback(err, null);
        }
    },

    findUser: async function (
        call: ServerUnaryCall<FindUserRequest, UserInfo>,
        callback: sendUnaryData<UserInfo>) {
        try {
            let { userId } = call.request.toObject();
            let userResponse = await userService.findUser(userId);

            if(!userResponse) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: grpc.status.NOT_FOUND.toString(),
                });
                return;
            }

            callback(null, userResponse);
        } catch (error: any) {
            logger.error(error.message);
            callback({
                code: grpc.status.INTERNAL,
                message: grpc.status.INTERNAL.toString(),
            });
            callback(error, null);
        }
    },

    getUsers: async function (
        call: ServerUnaryCall<GetUsersRequest, UsersInfo>,
        callback: sendUnaryData<UsersInfo>) {
        try {
            let { userIdsList } = call.request.toObject();
            let users = await userRepository.findAll({ where: { id: { [Op.in]: userIdsList } } });
            let usersInfo = users.map(user => new UserInfo()
                .setId(user.id)
                .setDisplayName(user.display_name)
                .setAvatar(user.avatar)
                .setEnabledTwofa(user.enabled_twofa));

            let usersResponse = new UsersInfo()
                .setUsersList(usersInfo)

            callback(null, usersResponse);
        } catch (err: any) {
            logger.error(err.message);
            callback(err, null);
        }
    },

    searchUser: async function (
        call: ServerUnaryCall<SearchUserRequest, UsersInfo>,
        callback: sendUnaryData<UsersInfo>) {
        let {
            term,
            pageNumber,
            pageSize
        } = call.request.toObject();

        pageNumber = pageNumber || 0;
        pageSize = pageSize || 20;

        try {
            let users = await userRepository.findAll({
                where: {
                    display_name: { [Op.like]: `%${term}%` }
                },
                limit: pageSize,
                offset: pageNumber * pageSize,
            });

            let usersList: UserInfo[] = users.map((user: any) => new UserInfo()
                .setId(user.id)
                .setDisplayName(user.display_name)
                .setAvatar(user.avatar)
                .setEnabledTwofa(user.enabled_twofa));;

            let usersResponse = new UsersInfo()
                .setUsersList(usersList);

            callback(null, usersResponse);
        } catch (err: any) {
            logger.error(err.message);
            callback(err, null);
        }
    }
}
