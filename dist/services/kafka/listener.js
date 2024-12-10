"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("services/kafka/index"));
const user_1 = __importDefault(require("database/models/user"));
const logging_1 = __importDefault(require("utils/logging"));
class KafkaListener {
    kafka;
    resolvers;
    constructor(kafka, resolvers) {
        this.kafka = kafka;
        this.resolvers = resolvers;
    }
    async listen() {
        for (const resolver of this.resolvers) {
            const consumer = this.kafka.consumer({ groupId: resolver.groupId });
            await consumer.connect();
            await consumer.subscribe({ topic: resolver.topic });
            await consumer.run({
                eachMessage: async (payload) => {
                    let message = JSON.parse(payload.message.value.toString());
                    await resolver.resolver(message);
                },
            });
        }
    }
}
let resolver = [
    {
        groupId: 'user-service-2fa',
        topic: 'user_updated_for_twofa',
        resolver: async ({ resourceId }) => {
            await user_1.default.update({ enabled_2fa: true }, { where: { id: resourceId } });
            logging_1.default.debug({ message: 'enabled 2fa successfully', resourceId });
        },
    }
];
exports.default = new KafkaListener(index_1.default, resolver);
//# sourceMappingURL=listener.js.map