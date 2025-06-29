import fastify, { FastifyInstance } from 'fastify';
import { inject, injectable } from 'inversify';
import fastifyCors from '@fastify/cors';
import { TYPES } from '../../shared/types/types.js';
import { LoggerService } from '../logger/logger.service.js';
import { registerLoggerMiddleware } from '../logger/middleware/fastify-logger.middleware.js';
import { registerSwaggerDocs } from '../docs/swagger.js';
import { RouteManager } from '../../interface/routes/routes.js';

@injectable()
export class Server {
  private fastify: FastifyInstance;
  private loggerService: LoggerService;
  private routeManager: RouteManager;

  constructor(@inject(TYPES.LoggerService) loggerService: LoggerService) {
    this.loggerService = loggerService;
    this.routeManager = new RouteManager(loggerService);
    this.fastify = fastify({
      logger: false
    });
  }

  async setup(): Promise<void> {
    registerLoggerMiddleware(this.fastify, this.loggerService);

    await this.fastify.register(fastifyCors, {
      origin: true
    });

    const routesRegistered = await this.routeManager.registerTsoaRoutes(this.fastify);

    try {
      await registerSwaggerDocs(this.fastify);
      this.loggerService.info('Swagger documentation registered successfully');
    } catch (error) {
      this.loggerService.error('Failed to register Swagger documentation', { error });
    }

    this.fastify.get('/', async () => {
      return {
        status: 'ok',
        message: 'Server is running',
        api: {
          available: routesRegistered,
          baseUrl: '/api',
          documentation: '/docs'
        },
        timestamp: new Date().toISOString()
      };
    });

    if (process.env.NODE_ENV === 'development') {
      this.fastify.post('/dev/reload-routes', async (request, reply) => {
        try {
          const success = await this.routeManager.hotReloadRoutes(this.fastify);
          reply.send({
            success,
            message: success ? 'Routes reloaded successfully' : 'Failed to reload routes',
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          reply.status(500).send({
            success: false,
            message: 'Error reloading routes',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });
    }

    this.fastify.setErrorHandler(async (error, request, reply) => {
      if (error.name === 'ValidateError' || error.toString().includes('ValidateError')) {
        let validationDetails = {};

        try {
          const tsoaError = error as any;

          if (tsoaError.details?.validationDetails) {
            validationDetails = tsoaError.details.validationDetails;
          } else {
            validationDetails = tsoaError.fields || {};
          }
        } catch (parseError) {
          this.loggerService.error('Failed to parse validation details', { error: parseError });
        }

        this.loggerService.error('Validation error:', {
          error: error.message || 'Request validation failed',
          details: validationDetails,
          url: request.url,
          method: request.method,
          body: request.body
        });

        return reply.status(400).send({
          error: 'Validation Error',
          message: 'The request data failed validation',
          details:
            Object.keys(validationDetails).length > 0
              ? validationDetails
              : 'Check the request format and try again',
          requestBody: request.body
        });
      }

      this.loggerService.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method
      });

      reply.status(500).send({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });
  }

  async start(): Promise<void> {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    const host = process.env.HOST || '0.0.0.0';

    try {
      await this.fastify.listen({ port, host });
      this.loggerService.info(`🚀 Server is running on http://localhost:${port}`);
      this.loggerService.info(`📚 Swagger documentation: http://localhost:${port}/docs`);
      this.loggerService.info(`❤️  Health check: http://localhost:${port}/`);

      if (process.env.NODE_ENV === 'development') {
        this.loggerService.info(
          `🔄 Route reload endpoint: POST http://localhost:${port}/dev/reload-routes`
        );
      }
    } catch (err) {
      this.loggerService.error('Failed to start server', { error: err });
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    try {
      await this.fastify.close();
      this.loggerService.info('Server stopped gracefully');
    } catch (err) {
      this.loggerService.error('Error stopping server', { error: err });
    }
  }

  getServer(): FastifyInstance {
    return this.fastify;
  }
}
