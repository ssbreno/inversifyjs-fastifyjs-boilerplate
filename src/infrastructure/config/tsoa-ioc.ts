import { IocContainer } from '@tsoa/runtime';
import { container } from './inversify.config.js';
import { UserController } from '../../interface/controllers/user.controller.js';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.use-case.js';
import { GetUserByIdUseCase } from '../../application/use-cases/user/get-user-byid.use-case.js';
import { TYPES } from '../../shared/types/types.js';

type ServiceIdentifier = string | symbol | { new (...args: unknown[]): unknown };

const iocContainer: IocContainer = {
  get<T>(controller: ServiceIdentifier): T {
    const controllerName =
      typeof controller === 'function' ? controller.name : controller.toString();

    console.log(`TSOA requesting controller: ${controllerName}`);

    try {
      if (typeof controller === 'string') {
        return container.get<T>(controller);
      } else if (typeof controller === 'function') {
        return container.get<T>(controller);
      } else {
        return container.get<T>(controller);
      }
    } catch (error) {
      if (controllerName === 'UserController' || controllerName === 'UserController_1') {
        const createUserUseCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);
        const getUserByIdUseCase = container.get<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase);

        const controller = new UserController(createUserUseCase, getUserByIdUseCase);

        return controller as unknown as T;
      }

      throw new Error(`Could not resolve controller: ${controllerName}`);
    }
  }
};

export { iocContainer };
export default iocContainer;
