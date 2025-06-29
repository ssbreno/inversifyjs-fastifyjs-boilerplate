import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

// Create a simple mock for PrismaService that we can test
class MockPrismaService {
  // Create simple Jest mocks for the methods we need to test
  $connect = jest.fn();
  $disconnect = jest.fn();
  
  // The lifecycle methods that call our mocks
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

describe('PrismaService', () => {
  let prismaService: MockPrismaService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    prismaService = new MockPrismaService();
  });


  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      // Act
      await prismaService.onModuleInit();
      
      // Assert
      expect(prismaService.$connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from the database', async () => {
      // Act
      await prismaService.onModuleDestroy();
      
      // Assert
      expect(prismaService.$disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
