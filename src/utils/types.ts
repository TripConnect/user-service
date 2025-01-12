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
    enabledTwofa: boolean;
}

export type AuthPayload = {
    userInfo: UserInfo;
    token: Token;
}
