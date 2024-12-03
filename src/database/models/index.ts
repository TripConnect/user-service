'use strict';

import logger from "utils/logging";

const Sequelize = require('sequelize');
const configs = require("database/config/config.js");
const env = process.env.NODE_ENV || 'development';
const db: { [key: string]: any; } = {};

let activeConfig = configs[env];

let sequelize = new Sequelize(activeConfig.database, activeConfig.username, activeConfig.password, activeConfig);
db.sequelize = sequelize;

(async () => {
    try {
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
})();

export default db;
