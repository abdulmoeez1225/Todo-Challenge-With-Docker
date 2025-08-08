import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import todoRoutes from '../routes';
import { authenticateJWT } from '../middleware';

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

// Create a valid JWT token for testing
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Match middleware default
const mockToken = jwt.sign(
  {
    uuid: 1, // Using integer ID as per current schema
    email: 'test@example.com',
  },
  JWT_SECRET,
  { expiresIn: '1h' }
);

describe('Todo Service Routes', () => {
  describe('POST /api/todos/', () => {
    it('should return 401 without JWT token', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
      };

      const response = await request(app)
        .post('/api/todos/')
        .send(todoData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(
        'Missing or invalid Authorization header'
      );
    });

    it('should return 400 for missing title', async () => {
      const todoData = {
        description: 'Test Description',
        status: 'pending',
      };

      const response = await request(app)
        .post('/api/todos/')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(todoData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Title and status are required');
    });

    it('should return 400 for missing status', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const response = await request(app)
        .post('/api/todos/')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(todoData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Title and status are required');
    });

    it('should return 400 for invalid status', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description',
        status: 'invalid-status',
      };

      const response = await request(app)
        .post('/api/todos/')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(todoData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(
        'Invalid status. Must be: pending, in-progress, or completed'
      );
    });
  });

  describe('GET /api/todos/', () => {
    it('should return 401 without JWT token', async () => {
      const response = await request(app).get('/api/todos/').expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(
        'Missing or invalid Authorization header'
      );
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should return 401 without JWT token', async () => {
      const todoData = {
        title: 'Updated Todo',
        description: 'Updated Description',
        status: 'completed',
      };

      const response = await request(app)
        .put('/api/todos/1')
        .send(todoData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(
        'Missing or invalid Authorization header'
      );
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should return 401 without JWT token', async () => {
      const response = await request(app).delete('/api/todos/1').expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(
        'Missing or invalid Authorization header'
      );
    });
  });
});
