import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { LoggerService } from '../../../src/infrastructure/logger/logger.service.js';

// Mock the winston module
jest.mock('winston', () => {
  const mockFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(() => ({})),
    json: jest.fn()
  };

  const mockTransports = {
    Console: jest.fn()
  };

  return {
    format: mockFormat,
    transports: mockTransports,
    createLogger: jest.fn(() => ({
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      http: jest.fn()
    }))
  };
});

// Mock the winston-daily-rotate-file module
jest.mock('winston-daily-rotate-file', () => {
  return jest.fn();
});

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(() => {
    // Create a new instance of the LoggerService before each test
    loggerService = new LoggerService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a logger instance', () => {
    expect(loggerService).toBeDefined();
  });

  describe('logging methods', () => {
    it('should have error method', () => {
      expect(typeof loggerService.error).toBe('function');
      const spy = jest.spyOn(loggerService['logger'], 'error');
      loggerService.error('test error');
      expect(spy).toHaveBeenCalledWith(
        'test error',
        expect.objectContaining({ timestamp: expect.any(String) })
      );
    });

    it('should have warn method', () => {
      expect(typeof loggerService.warn).toBe('function');
      const spy = jest.spyOn(loggerService['logger'], 'warn');
      loggerService.warn('test warning');
      expect(spy).toHaveBeenCalledWith(
        'test warning',
        expect.objectContaining({ timestamp: expect.any(String) })
      );
    });

    it('should have info method', () => {
      expect(typeof loggerService.info).toBe('function');
      const spy = jest.spyOn(loggerService['logger'], 'info');
      loggerService.info('test info');
      expect(spy).toHaveBeenCalledWith(
        'test info',
        expect.objectContaining({ timestamp: expect.any(String) })
      );
    });

    it('should have debug method', () => {
      expect(typeof loggerService.debug).toBe('function');
      const spy = jest.spyOn(loggerService['logger'], 'debug');
      loggerService.debug('test debug');
      expect(spy).toHaveBeenCalledWith(
        'test debug',
        expect.objectContaining({ timestamp: expect.any(String) })
      );
    });

    it('should have http method', () => {
      expect(typeof loggerService.http).toBe('function');
      const spy = jest.spyOn(loggerService['logger'], 'http');
      loggerService.http('test http');
      expect(spy).toHaveBeenCalledWith(
        'test http',
        expect.objectContaining({ timestamp: expect.any(String) })
      );
    });
  });

  describe('logger stream', () => {
    it('should have a stream for HTTP logging', () => {
      expect(loggerService.stream).toBeDefined();
      expect(typeof loggerService.stream.write).toBe('function');

      const httpSpy = jest.spyOn(loggerService, 'http');
      loggerService.stream.write('test stream\n');
      expect(httpSpy).toHaveBeenCalledWith('test stream');
    });
  });
});
