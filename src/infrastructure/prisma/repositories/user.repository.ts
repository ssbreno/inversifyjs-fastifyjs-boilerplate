import { injectable, inject } from 'inversify';
import { User } from '../../../domain/entities/user.entity.js';
import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { PrismaService } from '../prisma.service.js';
import { TYPES } from '../../../shared/types/types.js';

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();
    return users.map(
      (user) =>
        new User(user.id, user.email, user.name || undefined, user.createdAt, user.updatedAt)
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    });

    if (!user) return null;

    return new User(user.id, user.email, user.name || undefined, user.createdAt, user.updatedAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return new User(user.id, user.email, user.name || undefined, user.createdAt, user.updatedAt);
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    return new User(
      createdUser.id,
      createdUser.email,
      createdUser.name || undefined,
      createdUser.createdAt,
      createdUser.updatedAt
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        updatedAt: new Date()
      }
    });

    return new User(
      updatedUser.id,
      updatedUser.email,
      updatedUser.name || undefined,
      updatedUser.createdAt,
      updatedUser.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id }
    });
  }
}
