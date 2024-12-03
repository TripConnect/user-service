import jwt from 'jsonwebtoken';

import User from 'database/models/user';

export function getAccessToken(user: typeof User): string {
    let accessToken = jwt.sign(
        {
            userId: user.id,
            avatar: user.avatar,
        },
        process.env.JWT_SECRET_KEY || ""
    );
    return accessToken;
}