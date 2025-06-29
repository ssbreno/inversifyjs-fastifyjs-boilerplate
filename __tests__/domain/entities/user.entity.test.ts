import { User } from '../../../src/domain/entities/user.entity.js';

describe('User Entity', () => {
  const testId = 'test-id';
  const testEmail = 'test@example.com';
  const testName = 'Test User';
  const testCreatedAt = new Date();
  const testUpdatedAt = new Date();
  
  let user: User;
  
  beforeEach(() => {
    user = new User(testId, testEmail, testName, testCreatedAt, testUpdatedAt);
  });
  
  it('should create a user instance', () => {
    expect(user).toBeInstanceOf(User);
  });
  
  it('should have all properties set correctly', () => {
    expect(user.id).toBe(testId);
    expect(user.email).toBe(testEmail);
    expect(user.name).toBe(testName);
    expect(user.createdAt).toBe(testCreatedAt);
    expect(user.updatedAt).toBe(testUpdatedAt);
  });
  
  it('should convert to JSON correctly', () => {
    const json = user.toJSON();
    expect(json).toEqual({
      id: testId,
      email: testEmail,
      name: testName,
      createdAt: testCreatedAt,
      updatedAt: testUpdatedAt
    });
  });
});
