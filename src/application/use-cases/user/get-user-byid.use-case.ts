import { inject, injectable } from 'inversify';
import type { UserRepository } from '../../../domain/repositories/user.repository.js';
import { UserResponseDto } from '../../dtos/user.dto.js';
import { TYPES } from '../../../shared/types/types.js';

@injectable()
export class GetUserByIdUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return user.toJSON() as UserResponseDto;
  }
}
