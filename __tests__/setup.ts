// This file is run before tests
import { jest } from '@jest/globals';

// Setup test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.JWT_SECRET = 'test-secret';
// Use in-memory database for tests
process.env.DATABASE_URL = 'postgresql://fake:fake@localhost:5432/fake_db';
process.env.LOG_LEVEL = 'error';
process.env.LOG_DIR = 'logs';
process.env.SERVICE_NAME = 'test-service';
process.env.JWT_EXPIRATION = '1h';
process.env.CORS_ORIGIN = '*';

// Create a single instance of the mock that will be shared across tests
const mockPrismaClient = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  user: {
    findUnique: jest.fn().mockImplementation((args: { where: { id?: string; email?: string } }) => {
      // Return a specific user if id is provided
      if (args?.where?.id) {
        return Promise.resolve({
          id: args.where.id,
          email: 'test@example.com',
          name: 'Test User',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      return Promise.resolve(null);
    }),
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockImplementation((args: { data: any }) => {
      return Promise.resolve({
        id: 'new-user-id',
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    deleteMany: jest.fn().mockResolvedValue(undefined)
  }
};

// Mock PrismaClient globally
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// Mock the PrismaService methods that extend PrismaClient
jest.mock('../src/infrastructure/prisma/prisma.service.js', () => {
  // Use this approach to avoid the TypeScript errors
  const mockPrismaServiceInstance = {
    $connect: mockPrismaClient.$connect,
    $disconnect: mockPrismaClient.$disconnect,
    user: mockPrismaClient.user,
    onModuleInit: jest.fn().mockImplementation(async () => {
      await mockPrismaClient.$connect();
    }),
    onModuleDestroy: jest.fn().mockImplementation(async () => {
      await mockPrismaClient.$disconnect();
    })
  };

  return {
    PrismaService: jest.fn().mockImplementation(() => mockPrismaServiceInstance)
  };
});

// Increase the global Jest timeout for all tests
jest.setTimeout(120000); // 2 minutes to accommodate slower integration tests
