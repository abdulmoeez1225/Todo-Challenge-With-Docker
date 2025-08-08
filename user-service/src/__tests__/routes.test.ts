import request from 'supertest';
import express from 'express';
import userRoutes from '../routes';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Generate unique email for each test run
const generateUniqueEmail = () =>
  `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;

describe('User Service Routes', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: generateUniqueEmail(),
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('uuid');
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).not.toHaveProperty('password_hash');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: generateUniqueEmail(),
        password: 'password123',
      };

      // First registration should succeed
      await request(app).post('/api/users/register').send(userData).expect(201);

      // Second registration with same email should fail
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Email already registered');
    });

    it('should return 400 for invalid password length', async () => {
      const userData = {
        email: generateUniqueEmail(),
        password: '123',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should return 400 for missing email', async () => {
      const userData = {
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Email and password required');
    });

    it('should return 401 for invalid credentials', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid credentials');
    });
  });
});
