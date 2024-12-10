"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const winston_1 = __importDefault(require("winston"));
const path = require('path');
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "development" ? 'debug' : 'info',
    format: winston_1.default.format.json(),
    transports: [
        // write logs to the console
        new winston_1.default.transports.Console(),
        // write logs to a file
        new winston_1.default.transports.File({ filename: path.join(__dirname, '../../log/trip_connect.log') }),
    ]
});
exports.default = logger;
//# sourceMappingURL=logging.js.map