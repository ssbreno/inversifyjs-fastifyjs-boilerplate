import { inject, injectable } from 'inversify';
import { User } from '../../../domain/entities/user.entity.js';
import type { UserRepository } from '../../../domain/repositories/user.repository.js';
import { CreateUserDto, UserResponseDto } from '../../dtos/user.dto.js';
import { TYPES } from '../../../shared/types/types.js';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error(`User with email ${dto.email} already exists`);
    }

    const user = new User(
      crypto.randomUUID(),
      dto.email,
      dto.name
    );

    const createdUser = await this.userRepository.create(user);
    return createdUser.toJSON() as UserResponseDto;
  }
}
