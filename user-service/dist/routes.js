"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const router = (0, express_1.Router)();
// Registration endpoint
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: 'Invalid email or password (min 6 chars)' });
    }
    try {
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                email,
                passwordHash: hash
            },
            select: {
                id: true,
                email: true,
                createdAt: true
            }
        });
        return res.status(201).json({
            uuid: user.id,
            email: user.email,
            created_at: user.createdAt
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
});
// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ uuid: user.id, email: user.email }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
        return res.status(200).json({ token });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map