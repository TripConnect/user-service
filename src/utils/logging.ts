import 'dotenv/config';
import winston from 'winston';
const path = require('path');

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "development" ? 'debug' : 'info',
    format: winston.format.json(),
    transports: [
        // write logs to the console
        new winston.transports.Console(),
        // write logs to a file
        new winston.transports.File({ filename: path.join(__dirname, '../../log/trip_connect.log') }),
    ]
});

export default logger;