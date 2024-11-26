import { ConsumerEachMessagePayload, Kafka } from "kafkajs";

import KafkaInstance from "../kafka/index";
import logger from "../../utils/logging";

type TopicResolver = {
    topic: string,
    groupId: string,
    resolver: Function,
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
                    let message = JSON.parse(payload.message.value!.toString() as string);
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
        resolver: async (message: any) => {
            logger.debug(message);
        },
    }
]

export default new KafkaListener(KafkaInstance, resolver);
