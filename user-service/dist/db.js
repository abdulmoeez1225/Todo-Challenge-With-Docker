"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.prisma = new client_1.PrismaClient();
const initializeDatabase = async () => {
    try {
        await exports.prisma.$connect();
        console.log('Database connection established');
    }
    catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
const closeDatabase = async () => {
    await exports.prisma.$disconnect();
};
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=db.js.map