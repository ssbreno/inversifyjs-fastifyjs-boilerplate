import { IocContainer } from '@tsoa/runtime';
import { container } from './inversify.config.js';

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
      throw new Error(`Could not resolve controller: ${controllerName}`);
    }
  }
};

export { iocContainer };
export default iocContainer;
