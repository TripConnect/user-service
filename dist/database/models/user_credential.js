"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("database/models/index"));
const UserCredential = index_1.default.sequelize.define('UserCredential', {
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    credential: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'user_credential',
    timestamps: false,
});
exports.default = UserCredential;
//# sourceMappingURL=user_credential.js.map