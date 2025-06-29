import { FastifyInstance, FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { LoggerService } from '../logger.service.js';
import { generateRequestId } from './utils.js';

/**
 * Registers logging middleware with Fastify
 * @param fastify - The Fastify instance
 * @param loggerService - The logger service
 */
export function registerLoggerMiddleware(fastify: FastifyInstance, loggerService: LoggerService) {
  // Hook that runs before a request is processed
  fastify.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    // Generate a unique ID for the request if not already present
    const requestId = request.headers['x-request-id'] as string || generateRequestId();
    
    // Add the requestId to the request and response
    request.headers['x-request-id'] = requestId;
    reply.header('x-request-id', requestId);
    
    // Add start time to request for calculating duration later
    request.startTime = Date.now();
    
    // Log incoming request
    loggerService.info(`Incoming request`, {
      requestId,
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });
    
    done();
  });
  
  // Hook that runs after a response is sent
  fastify.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    const requestId = request.headers['x-request-id'] as string;
    const duration = Date.now() - (request.startTime || Date.now());
    
    // Log completed request
    loggerService.info(`Request completed`, {
      requestId,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
    });
    
    done();
  });
  
  // Hook for error handling
  fastify.addHook('onError', (request: FastifyRequest, reply: FastifyReply, error: Error, done: HookHandlerDoneFunction) => {
    const requestId = request.headers['x-request-id'] as string;
    
    // Log error
    loggerService.error(`Request error`, {
      requestId,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      error: error.message,
      stack: error.stack,
    });
    
    done();
  });
}
