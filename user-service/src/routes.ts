import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const router = Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Invalid email or password (min 6 chars)' });
  }
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = await prisma.user.create({
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
  } catch (err) {
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
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { uuid: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'supersecretkey', 
      { expiresIn: '1h' }
    );
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
