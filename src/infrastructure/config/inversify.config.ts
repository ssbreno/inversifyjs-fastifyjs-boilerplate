import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../shared/types/types.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.use-case.js';
import { GetUserByIdUseCase } from '../../application/use-cases/user/get-user-byid.use-case.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserRepositoryImpl } from '../prisma/repositories/user.repository.js';
import { LoggerService } from '../logger/logger.service.js';
import { UserController } from '../../interface/controllers/user.controller.js';
import { Server } from '../server/server.js';

export { UserController } from '../../interface/controllers/user.controller.js';

const container = new Container();

container.bind(TYPES.PrismaService).to(PrismaService).inSingletonScope();
container.bind(TYPES.LoggerService).to(LoggerService).inSingletonScope();

container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl).inSingletonScope();

container.bind(TYPES.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();
container.bind(TYPES.GetUserByIdUseCase).to(GetUserByIdUseCase).inSingletonScope();

container.bind(TYPES.UserController).to(UserController).inSingletonScope();

container.bind('UserController').to(UserController).inSingletonScope();

container.bind(TYPES.Server).to(Server).inSingletonScope();

export { container };
export default container;
export { container as iocContainer };
