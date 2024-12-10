"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("database/models/index"));
;
const User = index_1.default.sequelize.define('User', {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    display_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    enabled_2fa: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
}, {
    tableName: 'user',
    timestamps: false,
});
exports.default = User;
//# sourceMappingURL=user.js.map