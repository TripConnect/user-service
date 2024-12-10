'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("utils/logging"));
const Sequelize = require('sequelize');
const configs = require("database/config/config.js");
const env = process.env.NODE_ENV || 'development';
const db = {};
let activeConfig = configs[env];
let sequelize = new Sequelize(activeConfig.database, activeConfig.username, activeConfig.password, activeConfig);
db.sequelize = sequelize;
(async () => {
    try {
        await sequelize.authenticate();
        logging_1.default.info('Connection has been established successfully.');
    }
    catch (error) {
        logging_1.default.error('Unable to connect to the database:', error);
    }
})();
exports.default = db;
//# sourceMappingURL=index.js.map