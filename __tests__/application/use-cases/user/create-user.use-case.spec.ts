import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { CreateUserUseCase } from '../../../../src/application/use-cases/user/create-user.use-case.js';
import { User } from '../../../../src/domain/entities/user.entity.js';
import { UserRepository } from '../../../../src/domain/repositories/user.repository.js';
import { CreateUserDto } from '../../../../src/application/dtos/user.dto.js';

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockUser = new User('mocked-uuid', 'test@example.com', 'Test User', new Date(), new Date());

  beforeEach(() => {
    // Create mock repository
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  it('should throw an error if user with email already exists', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);

    // Act & Assert
    await expect(createUserUseCase.execute(mockCreateUserDto)).rejects.toThrow(
      `User with email ${mockCreateUserDto.email} already exists`
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should create a new user successfully', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.create.mockResolvedValueOnce(mockUser);

    // Act
    const result = await createUserUseCase.execute(mockCreateUserDto);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
    expect(result).toEqual(mockUser.toJSON());
  });
});
