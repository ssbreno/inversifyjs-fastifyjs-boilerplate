import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { UserController } from '../../../src/interface/controllers/user.controller.js';
import { CreateUserUseCase } from '../../../src/application/use-cases/user/create-user.use-case.js';
import { GetUserByIdUseCase } from '../../../src/application/use-cases/user/get-user-byid.use-case.js';
import { CreateUserDto, UserResponseDto } from '../../../src/application/dtos/user.dto.js';

describe('UserController', () => {
  let userController: UserController;
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;
  let mockGetUserByIdUseCase: jest.Mocked<GetUserByIdUseCase>;
  
  const mockUserResponse: UserResponseDto = {
    id: 'test-id',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    name: 'Test User'
  };
  
  beforeEach(() => {
    // Create mock use cases
    mockCreateUserUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<CreateUserUseCase>;
    
    mockGetUserByIdUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<GetUserByIdUseCase>;
    
    // Initialize controller with mocked use cases
    userController = new UserController(mockCreateUserUseCase, mockGetUserByIdUseCase);
  });
  
  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      mockCreateUserUseCase.execute.mockResolvedValueOnce(mockUserResponse);
      
      // Act
      const result = await userController.createUser(mockCreateUserDto);
      
      // Assert
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUserResponse);
    });
  });
  
  describe('getUserById', () => {
    it('should get a user by ID successfully', async () => {
      // Arrange
      mockGetUserByIdUseCase.execute.mockResolvedValueOnce(mockUserResponse);
      
      // Act
      const result = await userController.getUserById('test-id');
      
      // Assert
      expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(mockUserResponse);
    });
  });
});
