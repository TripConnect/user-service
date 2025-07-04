import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IUserServiceServer } from "node-proto-lib/protos/user_service_grpc_pb";
import { AuthenticatedInfo, FindUserRequest, GetUsersRequest, SearchUserRequest, SignInRequest, SignUpRequest, Token, UserInfo, UsersInfo } from "node-proto-lib/protos/user_service_pb";
import User from "database/models/user";
import UserCredential from "database/models/user_credential";
import bcrypt from "bcryptjs";
import { TokenHelper } from "common-utils";
import { v4 as uuidv4 } from 'uuid';
import * as grpc from '@grpc/grpc-js';
import logger from "utils/logging";
import { Op } from "sequelize";

export const userServiceImp: IUserServiceServer = {

    signIn: async function (
        call: ServerUnaryCall<SignInRequest, AuthenticatedInfo>,
        callback: sendUnaryData<AuthenticatedInfo>) {
        try {
            let { username, password } = call.request.toObject();
            let user = await User.findOne({ where: { username } });
            if (!user) throw new Error("User not found");

            let userCredential = await UserCredential.findOne({ where: { user_id: user.id } });
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
                avatar: avatarUrl || null,
                created_at: new Date(),
                updated_at: new Date(),
            });

            let userCredential = await UserCredential.create({
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
            let user = await User.findOne({ where: { id: userId } });
            if (!user) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'User not found'
                });
                return;
            }

            let userResponse = new UserInfo()
                .setId(user.id)
                .setDisplayName(user.display_name)
                .setAvatar(user.avatar)
                .setEnabledTwofa(user.enabled_twofa);

            callback(null, userResponse);
        } catch (error: any) {
            console.log(error);
            logger.error(error.message);
            callback(error, null);
        }
    },

    getUsers: async function (
        call: ServerUnaryCall<GetUsersRequest, UsersInfo>,
        callback: sendUnaryData<UsersInfo>) {
        try {
            let { userIdsList } = call.request.toObject();
            let users = await User.findAll({ where: { id: { [Op.in]: userIdsList } } });
            let usersInfo: UserInfo[] = users.map((user: any) => new UserInfo()
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
            let users = await User.findAll({
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
