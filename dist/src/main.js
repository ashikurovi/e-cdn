"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let cachedApp;
async function createApp() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn'],
        });
        app.enableCors({
            origin: true,
            credentials: false,
        });
        app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}
async function handler(req, res) {
    const app = await createApp();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
}
if (!process.env.VERCEL) {
    createApp().then(async (app) => {
        const port = process.env.PORT || 5000;
        await app.listen(port);
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
}
//# sourceMappingURL=main.js.map