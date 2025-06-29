import { FastifyInstance, FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { LoggerService } from '../logger.service.js';
import { generateRequestId } from './utils.js';

/**
 * Registers logging middleware with Fastify
 * @param fastify - The Fastify instance
 * @param loggerService - The logger service
 */
export function registerLoggerMiddleware(fastify: FastifyInstance, loggerService: LoggerService) {
  fastify.addHook(
    'onRequest',
    (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
      const requestId = (request.headers['x-request-id'] as string) || generateRequestId();

      request.headers['x-request-id'] = requestId;
      reply.header('x-request-id', requestId);

      request.startTime = Date.now();

      loggerService.info(`Incoming request`, {
        requestId,
        method: request.method,
        url: request.url,
        ip: request.ip,
        userAgent: request.headers['user-agent']
      });

      done();
    }
  );

  fastify.addHook(
    'onResponse',
    (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
      const requestId = request.headers['x-request-id'] as string;
      const duration = Date.now() - (request.startTime || Date.now());

      loggerService.info(`Request completed`, {
        requestId,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        duration: `${duration}ms`
      });

      done();
    }
  );

  fastify.addHook(
    'onError',
    (request: FastifyRequest, reply: FastifyReply, error: Error, done: HookHandlerDoneFunction) => {
      const requestId = request.headers['x-request-id'] as string;
      loggerService.error(`Request error`, {
        requestId,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        error: error.message,
        stack: error.stack
      });

      done();
    }
  );
}
