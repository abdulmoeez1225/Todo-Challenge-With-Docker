import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../db';
import type { CreateUserRequest, LoginRequest, LoginResponse, UserResponse, JWTPayload } from '../types';
import { validateCreateUserRequest, validateLoginRequest, ValidationError } from '../utils/validation';

export class UserService {
  private readonly saltRounds = 10;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn = '24h';

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'supersecretkey';
    if (this.jwtSecret === 'supersecretkey') {
      console.warn('WARNING: Using default JWT secret. Set JWT_SECRET environment variable in production.');
    }
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    validateCreateUserRequest(userData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, this.saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      uuid: user.id.toString(),
      email: user.email,
      created_at: user.createdAt,
    };
  }

  async authenticateUser(loginData: LoginRequest): Promise<LoginResponse> {
    validateLoginRequest(loginData);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new ValidationError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid credentials');
    }

    // Generate JWT token
    const payload: JWTPayload = {
      uuid: user.id.toString(),
      email: user.email,
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });

    return { token };
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new ValidationError('Invalid or expired token');
    }
  }
}
