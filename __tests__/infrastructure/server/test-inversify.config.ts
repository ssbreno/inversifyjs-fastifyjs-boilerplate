import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../../src/shared/types/types.js';
import { LoggerService } from '../../../src/infrastructure/logger/logger.service.js';
import { PrismaService } from '../../../src/infrastructure/prisma/prisma.service.js';
import { UserRepositoryImpl } from '../../../src/infrastructure/prisma/repositories/user.repository.js';
import { CreateUserUseCase } from '../../../src/application/use-cases/user/create-user.use-case.js';
import { GetUserByIdUseCase } from '../../../src/application/use-cases/user/get-user-byid.use-case.js';
import { UserController } from '../../../src/interface/controllers/user.controller.js';
import { UserRepository } from '../../../src/domain/repositories/user.repository.js';
import { Server } from '../../../src/infrastructure/server/server.js';

// Create a test container that avoids the circular dependency
const testContainer = new Container();

// Configure the services in the correct order
testContainer.bind(TYPES.LoggerService).to(LoggerService).inSingletonScope();
testContainer.bind(TYPES.PrismaService).to(PrismaService).inSingletonScope();
testContainer.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl).inSingletonScope();
testContainer.bind(TYPES.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();
testContainer.bind(TYPES.GetUserByIdUseCase).to(GetUserByIdUseCase).inSingletonScope();
testContainer.bind(TYPES.UserController).to(UserController).inSingletonScope();
// Server MUST be bound last to avoid circular dependency
testContainer.bind(TYPES.Server).to(Server).inSingletonScope();

export { testContainer };
