import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('📋 Please create a .env file based on example.env');
  console.error(
    '💡 Example: DATABASE_URL="postgresql://postgres:password@postgres:5432/todo_db?schema=public"'
  );
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
});

export const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  await prisma.$disconnect();
};

export { prisma };
export default prisma;
