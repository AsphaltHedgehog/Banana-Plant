"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./../../controllers/auth");
const middlewares_1 = require("../../middlewares");
const router = express_1.default.Router();
router.post('/register', auth_1.ctrl.register);
router.post('/login', auth_1.ctrl.login);
router.patch('/logout', middlewares_1.authenticate, auth_1.ctrl.logout);
router.post('/resetPassword/', auth_1.ctrl.resetPassword);
router.patch('/newPassword/:resetToken', auth_1.ctrl.newPassword);
exports.default = router;
