import { Router } from 'express';
import { prisma } from './db';
import { authenticateJWT, AuthRequest } from './middleware';

const router = Router();

// Create Todo
router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  const { title, description, status } = req.body;
  if (!title || !status) {
    return res.status(400).json({ message: 'Title and status are required' });
  }
  
  // Validate status values
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be: pending, in-progress, or completed' });
  }
  try {
    const todo = await prisma.todo.create({
      data: {
        userUuid: req.user!.uuid,
        title,
        description: description || '',
        status
      }
    });
    
    return res.status(201).json(todo);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

// Read Todos
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userUuid: req.user!.uuid },
      orderBy: { createdAt: 'desc' }
    });
    
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

// Update Todo
router.put('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  const { title, description, status } = req.body;
  const { id } = req.params;
  try {
    // First check if todo exists and belongs to user
    const todo = await prisma.todo.findFirst({
      where: { 
        id: parseInt(id),
        userUuid: req.user!.uuid
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Update the todo
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        title: title || todo.title,
        description: description || todo.description,
        status: status || todo.status
      }
    });
    
    return res.status(200).json(updatedTodo);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

// Delete Todo
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    // First check if todo exists and belongs to user
    const todo = await prisma.todo.findFirst({
      where: { 
        id: parseInt(id),
        userUuid: req.user!.uuid
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Delete the todo
    await prisma.todo.delete({
      where: { id: parseInt(id) }
    });
    
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
