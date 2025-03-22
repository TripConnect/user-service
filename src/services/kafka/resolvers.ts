import { TopicResolver } from 'common-utils';

import User from "database/models/user";
import logger from "utils/logging";

export const resolvers: TopicResolver[] = [
    {
        groupId: 'user-service-2fa',
        topic: 'user_updated_for_twofa',
        resolver: async ({ resourceId }) => {
            await User.update(
                { enabled_twofa: true },
                { where: { id: resourceId } }
            );
            logger.debug({ message: 'enabled 2fa successfully', resourceId });
        },
    }
]
