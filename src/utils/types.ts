export type Token = {
    accessToken: string;
    refreshToken: string;
}

export type UserInfo = {
    // public area
    id: string;
    avatar: string | null;
    displayName: string;
    // private area
    enabled2fa: boolean;
}

export type AuthPayload = {
    userInfo: UserInfo;
    token: Token;
}
