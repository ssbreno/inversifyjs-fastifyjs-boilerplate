import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100).optional()
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional()
});

export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;
export type UpdateUserDtoType = z.infer<typeof UpdateUserSchema>;

/**
 * Request DTO for creating a user
 */
export class CreateUserDto {
  email!: string;
  name?: string;
}

/**
 * Request DTO for updating a user
 */
export class UpdateUserDto {
  name?: string;
}

/**
 * Response DTO for user data
 */
export class UserResponseDto {
  id!: string;
  email!: string;
  name?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
