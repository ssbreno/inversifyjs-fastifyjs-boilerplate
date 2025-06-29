export const TYPES = {
  Server: Symbol.for('Server'),
  Application: Symbol.for('Application'),
  UserRepository: Symbol.for('UserRepository'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  GetUserByIdUseCase: Symbol.for('GetUserByIdUseCase'),
  GetAllUsersUseCase: Symbol.for('GetAllUsersUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  PrismaService: Symbol.for('PrismaService'),
  UserController: Symbol.for('UserController'),
  LoggerService: Symbol.for('LoggerService')
};
