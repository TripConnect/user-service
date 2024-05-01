import jwt from 'jsonwebtoken';

import User from '../database/models/user';

export function getAccessToken(user: typeof User): string {
    let accessToken = jwt.sign(
        {
            user_id: user.id,
            username: user.username,
            avatar: user.avatar,
        },
        process.env.JWT_SECRET_KEY || ""
    );
    return accessToken;
}