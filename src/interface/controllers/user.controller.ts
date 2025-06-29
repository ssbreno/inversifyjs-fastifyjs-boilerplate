import { inject, injectable } from 'inversify';
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  Tags,
  Response,
  SuccessResponse,
  Example
} from '@tsoa/runtime';
import * as userDto from '../../application/dtos/user.dto.js';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.use-case.js';
import { GetUserByIdUseCase } from '../../application/use-cases/user/get-user-byid.use-case.js';
import { TYPES } from '../../shared/types/types.js';

@injectable()
@Route('users')
@Tags('User')
export class UserController extends Controller {
  constructor(
    @inject(TYPES.CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
    @inject(TYPES.GetUserByIdUseCase) private getUserByIdUseCase: GetUserByIdUseCase
  ) {
    super();
  }

  /**
   * Create a new user
   * @summary Creates a new user in the system
   * @param requestBody User information to create
   * @example requestBody { "email": "user@example.com", "name": "John Doe" }
   * @returns The created user data
   */
  @Post()
  @SuccessResponse('201', 'Created')
  @Response('409', 'Conflict - Email already exists')
  @Response('400', 'Bad Request - Invalid input')
  @Example<userDto.UserResponseDto>({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  public async createUser(
    @Body() requestBody: userDto.CreateUserDto
  ): Promise<userDto.UserResponseDto> {
    if (!requestBody || !requestBody.email) {
      throw new Error('Request body must include a valid email');
    }
    const validatedData = userDto.CreateUserSchema.parse(requestBody);
    return this.createUserUseCase.execute(validatedData);
  }

  /**
   * Get a user by ID
   * @summary Retrieves a user by their unique identifier
   * @param userId The unique identifier of the user
   * @returns The user data
   */
  @Get('{userId}')
  @Response('404', 'Not Found - User does not exist')
  @Example<userDto.UserResponseDto>({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  public async getUserById(@Path() userId: string): Promise<userDto.UserResponseDto> {
    return this.getUserByIdUseCase.execute(userId);
  }

  /**
   * Get a user by ID (alternate endpoint)
   * @summary Retrieves a user by their unique identifier (alternate endpoint)
   * @param userId The unique identifier of the user
   * @returns The user data
   */
  @Get('alternate/{userId}')
  @Response('404', 'Not Found - User does not exist')
  @Example<userDto.UserResponseDto>({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  public async getUserById2(@Path() userId: string): Promise<userDto.UserResponseDto> {
    return this.getUserByIdUseCase.execute(userId);
  }
}
