import { KafkaListener, TopicResolver } from 'common-utils';

import KafkaInstance from "services/kafka/index";
import User from "database/models/user";
import logger from "utils/logging";

const resolver: TopicResolver[] = [
    {
        groupId: 'user-service-2fa',
        topic: 'user_updated_for_twofa',
        resolver: async ({ resourceId }) => {
            await User.update(
                { enabled_2fa: true },
                { where: { id: resourceId } }
            );
            logger.debug({ message: 'enabled 2fa successfully', resourceId });
        },
    }
]

export default new KafkaListener(KafkaInstance, resolver);
