import { LoggerService } from '@/infrastructure/logger/logger.service.js';
import { FastifyInstance } from 'fastify';
import { existsSync } from 'fs';
import { join } from 'path';
import fastifyExpress from '@fastify/express';
import express from 'express';

export class RouteManager {
  constructor(private logger: LoggerService) {}

  async registerTsoaRoutes(fastify: FastifyInstance): Promise<boolean> {
    const distRoutesPath = join(process.cwd(), 'dist/generated/routes.js');
    const srcRoutesPath = join(process.cwd(), 'src/generated/routes.js');
    const routesPath = existsSync(distRoutesPath) ? distRoutesPath : srcRoutesPath;

    if (!existsSync(routesPath)) {
      this.logger.warn('TSOA routes file not found. Routes will not be available.');
      this.registerFallbackRoutes(fastify);
      return false;
    }

    try {
      const fileUrl = `file://${routesPath}`;
      const routesModule = await import(fileUrl);

      if (!routesModule.RegisterRoutes) {
        throw new Error('RegisterRoutes function not found in generated routes');
      }

      await fastify.register(fastifyExpress);

      const expressRouter = express.Router();

      expressRouter.use(express.json());
      expressRouter.use(express.urlencoded({ extended: true }));

      routesModule.RegisterRoutes(expressRouter);
      fastify.use('/api', expressRouter);

      this.logger.info('TSOA routes registered successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to register TSOA routes:');
      this.registerFallbackRoutes(fastify);
      return false;
    }
  }

  private registerFallbackRoutes(fastify: FastifyInstance): void {
    fastify.get('/api/*', async (request, reply) => {
      reply.status(503).send({
        error: 'Service Unavailable',
        message: 'API routes are not available. Please generate TSOA routes first.',
        instructions: 'Run: npm run swagger:generate',
        path: request.url
      });
    });

    fastify.post('/api/*', async (request, reply) => {
      reply.status(503).send({
        error: 'Service Unavailable',
        message: 'API routes are not available. Please generate TSOA routes first.',
        instructions: 'Run: npm run swagger:generate',
        path: request.url
      });
    });

    fastify.put('/api/*', async (request, reply) => {
      reply.status(503).send({
        error: 'Service Unavailable',
        message: 'API routes are not available. Please generate TSOA routes first.',
        instructions: 'Run: npm run swagger:generate',
        path: request.url
      });
    });

    fastify.delete('/api/*', async (request, reply) => {
      reply.status(503).send({
        error: 'Service Unavailable',
        message: 'API routes are not available. Please generate TSOA routes first.',
        instructions: 'Run: npm run swagger:generate',
        path: request.url
      });
    });

    this.logger.info('Fallback routes registered - API endpoints will return 503');
  }

  async hotReloadRoutes(fastify: FastifyInstance): Promise<boolean> {
    this.logger.info('Attempting to hot-reload TSOA routes...');

    const routesPath = join(process.cwd(), 'src/generated/routes.js');
    delete require.cache[routesPath];

    return this.registerTsoaRoutes(fastify);
  }
}
