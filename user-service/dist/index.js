"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/users', routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'user-service' });
});
const startServer = async () => {
    try {
        await (0, db_1.initializeDatabase)();
        const server = app.listen(PORT, () => {
            console.log(`User Service running on port ${PORT}`);
        });
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(async () => {
                await (0, db_1.closeDatabase)();
                process.exit(0);
            });
        });
        process.on('SIGINT', async () => {
            console.log('SIGINT received, shutting down gracefully');
            server.close(async () => {
                await (0, db_1.closeDatabase)();
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map