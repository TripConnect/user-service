import { ConsumerEachMessagePayload, Kafka } from "kafkajs";

import KafkaInstance from "../kafka/index";
import logger from "../../utils/logging";

type TopicResolver = {
    groupId: string,
    topic: string,
    resolver: (message: Record<string, string>) => Promise<void>,
}

class KafkaListener {
    constructor(private kafka: Kafka, private resolvers: TopicResolver[]) { }

    async listen() {
        for (const resolver of this.resolvers) {
            const consumer = this.kafka.consumer({ groupId: resolver.groupId });
            await consumer.connect();
            await consumer.subscribe({ topic: resolver.topic });
            await consumer.run({
                eachMessage: async (payload: ConsumerEachMessagePayload) => {
                    let message = JSON.parse(payload.message.value!.toString()) as Record<string, string>;
                    await resolver.resolver(message);
                },
            });
        }
    }
}

let resolver: TopicResolver[] = [
    {
        groupId: 'user-service-signout',
        topic: 'user-signout',
        resolver: async (message) => {
            logger.debug(message);
        },
    }
]

export default new KafkaListener(KafkaInstance, resolver);
