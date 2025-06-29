import fastify, { FastifyInstance } from 'fastify';
import { inject, injectable } from 'inversify';
import fastifyCors from '@fastify/cors';
import { TYPES } from '../../shared/types/types.js';
import { LoggerService } from '../logger/logger.service.js';
import { registerLoggerMiddleware } from '../logger/middleware/fastify-logger.middleware.js';
import { registerSwaggerDocs } from '../docs/swagger.js';

@injectable()
export class Server {
  private fastify: FastifyInstance;
  private loggerService: LoggerService;

  constructor(
    @inject(TYPES.LoggerService) loggerService: LoggerService
  ) {
    this.loggerService = loggerService;
    this.fastify = fastify({
      logger: false
    });
  }

  async setup(): Promise<void> {
    registerLoggerMiddleware(this.fastify, this.loggerService);
    await this.fastify.register(fastifyCors, { 
      origin: true 
    });

    try {
      const { RegisterRoutes } = await import('../../generated/routes.js');
      
      this.fastify.register(async (instance) => {
        RegisterRoutes(instance as any);
      }, { prefix: '/api' });
      
      this.loggerService.info('API routes registered successfully');
    } catch (error) {
      this.loggerService.error('Failed to register TSOA routes', { error });
      throw error;
    }
    
    try {
      await registerSwaggerDocs(this.fastify);
      this.loggerService.info('Swagger documentation registered successfully');
    } catch (error) {
      this.loggerService.error('Failed to register Swagger documentation', { error });
      // Non-fatal error, continue server initialization
    }
    
    this.fastify.get('/', async () => {
      return { status: 'ok', message: 'Server is running' };
    });
  }

  async start(): Promise<void> {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    try {
      await this.fastify.listen({ port, host: '0.0.0.0' });
      this.loggerService.info(`Server is running on http://localhost:${port}`);
      this.loggerService.info(`Swagger documentation available at http://localhost:${port}/docs`);
    } catch (err) {
      this.loggerService.error('Failed to start server', { error: err });
      process.exit(1);
    }
  }

  getServer(): FastifyInstance {
    return this.fastify;
  }
}
