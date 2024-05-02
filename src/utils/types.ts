export type Token = {
    accessToken: string;
    refreshToken: string;
}

export type UserInfo = {
    id: string;
    avatar: string | null;
    username: string;
    displayName: string;
}

export type AuthPayload = {
    userInfo: UserInfo;
    token: Token;
}