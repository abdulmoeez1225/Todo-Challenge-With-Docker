"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
// Create Todo
router.post('/', middleware_1.authenticateJWT, async (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !status) {
        return res.status(400).json({ message: 'Title and status are required' });
    }
    try {
        const todo = await db_1.prisma.todo.create({
            data: {
                userUuid: req.user.uuid,
                title,
                description: description || '',
                status
            }
        });
        return res.status(201).json(todo);
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
});
// Read Todos
router.get('/', middleware_1.authenticateJWT, async (req, res) => {
    try {
        const todos = await db_1.prisma.todo.findMany({
            where: { userUuid: req.user.uuid },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(todos);
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
});
// Update Todo
router.put('/:id', middleware_1.authenticateJWT, async (req, res) => {
    const { title, description, status } = req.body;
    const { id } = req.params;
    try {
        const todo = await db_1.prisma.todo.findFirst({
            where: {
                id: parseInt(id),
                userUuid: req.user.uuid
            }
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        const updatedTodo = await db_1.prisma.todo.update({
            where: { id: parseInt(id) },
            data: {
                title: title || todo.title,
                description: description || todo.description,
                status: status || todo.status
            }
        });
        return res.status(200).json(updatedTodo);
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
});
// Delete Todo
router.delete('/:id', middleware_1.authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await db_1.prisma.todo.findFirst({
            where: {
                id: parseInt(id),
                userUuid: req.user.uuid
            }
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        await db_1.prisma.todo.delete({
            where: { id: parseInt(id) }
        });
        return res.status(204).send();
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map