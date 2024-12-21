export type Token = {
    access_token: string;
    refresh_token: string;
}

export type UserInfo = {
    // public area
    id: string;
    avatar: string | null;
    display_name: string;
    // private area
    enabled_2fa: boolean;
}

export type AuthPayload = {
    user_info: UserInfo;
    token: Token;
}
