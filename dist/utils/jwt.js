"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getAccessToken(user) {
    let accessToken = jsonwebtoken_1.default.sign({
        userId: user.id,
        avatar: user.avatar,
    }, process.env.JWT_SECRET_KEY || "");
    return accessToken;
}
//# sourceMappingURL=jwt.js.map