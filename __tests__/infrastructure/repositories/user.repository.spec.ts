import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { UserRepositoryImpl } from '../../../src/infrastructure/prisma/repositories/user.repository.js';
import { PrismaService } from '../../../src/infrastructure/prisma/prisma.service.js';
import { User } from '../../../src/domain/entities/user.entity.js';

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl;
  let mockPrismaService: jest.Mocked<PrismaService>;

  const mockDate = new Date();
  const mockUserData = {
    id: 'test-id',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: mockDate,
    updatedAt: mockDate
  };

  beforeEach(() => {
    // Create mock PrismaService with proper jest.fn() mocks
    mockPrismaService = {
      user: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        count: jest.fn().mockResolvedValue(0)
      },
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<PrismaService>;

    userRepository = new UserRepositoryImpl(mockPrismaService);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const mockPrismaUsers = [mockUserData];
      mockPrismaService.user.findMany.mockResolvedValueOnce(mockPrismaUsers);

      // Act
      const result = await userRepository.findAll();

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].id).toBe(mockUserData.id);
      expect(result[0].email).toBe(mockUserData.email);
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUserData);

      // Act
      const result = await userRepository.findById('test-id');

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' }
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(mockUserData.id);
    });

    it('should return null when user not found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      // Act
      const result = await userRepository.findById('non-existent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const userToCreate = new User(
        'test-id',
        'test@example.com',
        'Test User',
        undefined,
        undefined
      );

      mockPrismaService.user.create.mockResolvedValueOnce(mockUserData);

      // Act
      const result = await userRepository.create(userToCreate);

      // Assert
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: userToCreate.id,
          email: userToCreate.email,
          name: userToCreate.name
        }
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(mockUserData.id);
    });
  });
});
