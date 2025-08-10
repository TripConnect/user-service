import {ConfigHelper, TopicResolver} from 'common-utils';

import User from "database/models/user";
import logger from "utils/logging";

export const resolvers: TopicResolver[] = [
    {
        groupId: process.env.SERVICE_NAME || 'user-service',
        topic: ConfigHelper.read('kafka.topic.user-fct-enabled-2fa') as string,
        resolver: async ({ resourceId }) => {
            await User.update(
                { enabled_twofa: true },
                { where: { id: resourceId } }
            );
            logger.debug({ message: 'enabled 2fa successfully', resourceId });
        },
    }
]
