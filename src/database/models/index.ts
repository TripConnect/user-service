'use strict';

import { Sequelize } from 'sequelize-typescript';

import configs from "database/config/config";
import logger from "utils/logging";
import User from "./user";
import UserCredential from "./user_credential";

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: configs.host,
  username: configs.username,
  password: configs.password,
  database: configs.database,
  models: [User, UserCredential],
  repositoryMode: true,
});

(async () => {
    try {
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
})();

export default sequelize;
