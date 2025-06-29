import { FastifyInstance } from 'fastify';
import { container } from '../../src/infrastructure/config/inversify.config.js';
import { TYPES } from '../../src/shared/types/types.js';
import { Server } from '../../src/infrastructure/server/server.js';
import { PrismaService } from '../../src/infrastructure/database/prisma.service.js';

describe('User API Integration Tests', () => {
  let app: FastifyInstance;
  let prismaService: PrismaService;
  
  beforeAll(async () => {
    // Get server instance from DI container
    const server = container.get<Server>(TYPES.Server);
    await server.setup();
    app = server.getServer();
    
    // Get PrismaService for database cleanup
    prismaService = container.get<PrismaService>(TYPES.PrismaService);
    
    // Clean the database before all tests
    await prismaService.user.deleteMany({});
  });
  
  afterAll(async () => {
    // Clean up test data
    await prismaService.user.deleteMany({});
  });
  
  // Clean database between tests
  afterEach(async () => {
    await prismaService.user.deleteMany({});
  });
  
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Integration Test User'
      };
      
      // Make request to create user
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: userData
      });
      
      // Assert response
      expect(response.statusCode).toBe(201); // Status should be 201 Created
      
      const responseBody = JSON.parse(response.body);
      expect(responseBody.email).toBe(userData.email);
      expect(responseBody.name).toBe(userData.name);
      expect(responseBody.id).toBeDefined();
      
      // Store user ID for other tests
      const userId = responseBody.id;
      
      // Verify user exists in database
      const createdUser = await prismaService.user.findUnique({
        where: { id: userId }
      });
      
      expect(createdUser).not.toBeNull();
      // Use the actual data returned, not the test data since it might have been modified
      expect(createdUser?.email).toBe(responseBody.email);
    });
    
    it('should return an error when email already exists', async () => {
      // First create a user
      const initialUser = {
        email: 'test@example.com',
        name: 'Initial User'
      };
      
      await app.inject({
        method: 'POST',
        url: '/users',
        payload: initialUser
      });
      
      // Then try to create another user with the same email
      const duplicateUser = {
        email: 'test@example.com',
        name: 'Duplicate User'
      };
      
      // Make request to create user with duplicate email
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: duplicateUser
      });
      
      // Assert error response
      expect(response.statusCode).toBe(409); // Should return Conflict status code
      expect(JSON.parse(response.body)).toHaveProperty('error');
    });
  });
  
  describe('GET /users/{id}', () => {
    it('should get a user by ID', async () => {
      // First create a user
      const userData = {
        email: 'test@example.com',
        name: 'Get Test User'
      };
      
      const createResponse = await app.inject({
        method: 'POST',
        url: '/users',
        payload: userData
      });
      
      const { id } = JSON.parse(createResponse.body);
      
      // Get user by ID
      const response = await app.inject({
        method: 'GET',
        url: `/users/${id}`
      });
      
      // Assert response
      expect(response.statusCode).toBe(200); // GET requests should return 200 OK
      
      const responseBody = JSON.parse(response.body);
      expect(responseBody.id).toBe(id);
      expect(responseBody.email).toBe(userData.email);
      expect(responseBody.name).toBe(userData.name);
    });
    
    it('should return not found for non-existent user ID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/00000000-0000-0000-0000-000000000000' // Use a valid format UUID that doesn't exist
      });
      
      expect(response.statusCode).toBe(404);
    });
  });
});
