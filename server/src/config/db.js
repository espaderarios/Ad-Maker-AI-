import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to MongoDB via Prisma');
    return prisma;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

export { prisma };
