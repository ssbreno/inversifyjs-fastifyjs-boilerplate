import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { registerLoggerMiddleware } from '../../../../src/infrastructure/logger/middleware/fastify-logger.middleware.js';
import { LoggerService } from '../../../../src/infrastructure/logger/logger.service.js';

describe('Fastify Logger Middleware', () => {
  let mockFastify: FastifyInstance;
  let mockLoggerService: LoggerService;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let doneMock: jest.Mock;

  beforeEach(() => {
    // Create mock for LoggerService
    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      http: jest.fn(),
      stream: {
        write: jest.fn()
      }
    } as unknown as LoggerService;

    // Create mocks for request and reply
    mockRequest = {
      headers: {},
      url: '/test',
      method: 'GET',
      ip: '127.0.0.1'
    };

    mockReply = {
      statusCode: 200,
      header: jest.fn()
    };

    // Create done callback
    doneMock = jest.fn();

    // Create Fastify instance mock
    mockFastify = {
      addHook: jest.fn()
    } as unknown as FastifyInstance;
  });

  it('should register onRequest, onResponse, and onError hooks', () => {
    // Register the middleware
    registerLoggerMiddleware(mockFastify, mockLoggerService);

    // Verify that hooks were registered
    expect(mockFastify.addHook).toHaveBeenCalledWith('onRequest', expect.any(Function));
    expect(mockFastify.addHook).toHaveBeenCalledWith('onResponse', expect.any(Function));
    expect(mockFastify.addHook).toHaveBeenCalledWith('onError', expect.any(Function));
  });

  it('should log incoming requests in the onRequest hook', () => {
    // Register the middleware
    registerLoggerMiddleware(mockFastify, mockLoggerService);

    // Get the onRequest hook function
    const onRequestHook = (mockFastify.addHook as jest.Mock).mock.calls.find(
      (call) => call[0] === 'onRequest'
    )[1];

    // Call the hook
    onRequestHook(mockRequest, mockReply, doneMock);

    // Verify that the logger was called
    expect(mockLoggerService.info).toHaveBeenCalledWith(
      'Incoming request',
      expect.objectContaining({
        method: 'GET',
        url: '/test',
        ip: '127.0.0.1',
        requestId: expect.any(String)
      })
    );

    // Verify that the done callback was called
    expect(doneMock).toHaveBeenCalled();

    // Verify that request headers were updated
    expect(mockRequest.headers!['x-request-id']).toBeDefined();

    // Verify that the reply header was set
    expect(mockReply.header).toHaveBeenCalledWith('x-request-id', expect.any(String));
  });
});
