"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
// import reviewsRouter from "./routes/api/reviews-router.js";
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const quizes_router_js_1 = __importDefault(require("./routes/api/quizes-router.js"));
const auth_js_1 = __importDefault(require("./routes/api/auth.js"));
const user_js_1 = __importDefault(require("./routes/api/user.js"));
const quiz_question_1 = __importDefault(require("./routes/api/quiz-question"));
const app = (0, express_1.default)();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use((0, morgan_1.default)(formatsLogger));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
// auth routes
app.use('/api/auth', auth_js_1.default);
// app.use('api/reviews', reviewsRoutes);
// get sorted quizes routes
app.use('/api/quizes', quizes_router_js_1.default);
// quizQuestion routes
app.use('/api/quiz/question', quiz_question_1.default);
// swagger routes
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use('/api/user', user_js_1.default);
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});
app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});
exports.default = app;
