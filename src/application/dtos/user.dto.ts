import { z } from 'zod';

// Zod schemas for runtime validation
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100).optional()
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional()
});

// Type for internal use with Zod
export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;
export type UpdateUserDtoType = z.infer<typeof UpdateUserSchema>;

// Class definitions for TSOA documentation generation

/**
 * Request DTO for creating a user
 */
export class CreateUserDto {
  /**
   * User's email address
   * @format email
   * @example "user@example.com"
   */
  email!: string;

  /**
   * User's name
   * @minLength 1
   * @maxLength 100
   * @example "John Doe"
   */
  name?: string;
}

/**
 * Request DTO for updating a user
 */
export class UpdateUserDto {
  /**
   * User's name
   * @minLength 1
   * @maxLength 100
   * @example "Jane Doe"
   */
  name?: string;
}

/**
 * Response DTO for user data
 */
export class UserResponseDto {
  /**
   * Unique identifier for the user
   * @format uuid
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id!: string;

  /**
   * User's email address
   * @format email
   * @example "user@example.com"
   */
  email!: string;

  /**
   * User's name
   * @example "John Doe"
   */
  name?: string;

  /**
   * When the user was created
   * @format date-time
   */
  createdAt!: Date;

  /**
   * When the user was last updated
   * @format date-time
   */
  updatedAt!: Date;
}
