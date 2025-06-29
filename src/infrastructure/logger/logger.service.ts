import { injectable } from 'inversify';
import { createLogger, Logger, format } from 'winston';
import { consoleTransport } from './transports/console.transport.js';
import { fileTransports } from './transports/file.transport.js';
import { loggerConfig, getLogLevel } from './logger.config.js';

const { errors } = format;

/**
 * LoggerService provides a centralized logging mechanism for the application
 */
@injectable()
export class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: getLogLevel(),
      defaultMeta: { service: loggerConfig.service },
      format: format.combine(
        format.timestamp(),
        errors({ stack: true }),
        format.json()
      ),
      transports: [
        consoleTransport,
        ...fileTransports
      ],
      exitOnError: false
    });
  }

  /**
   * Log an error message
   * @param message - The log message
   * @param meta - Additional metadata
   */
  error(message: string, meta: Record<string, any> = {}) {
    this.logger.error(message, { ...meta, timestamp: new Date().toISOString() });
  }

  /**
   * Log a warning message
   * @param message - The log message
   * @param meta - Additional metadata
   */
  warn(message: string, meta: Record<string, any> = {}) {
    this.logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
  }

  /**
   * Log an info message
   * @param message - The log message
   * @param meta - Additional metadata
   */
  info(message: string, meta: Record<string, any> = {}) {
    this.logger.info(message, { ...meta, timestamp: new Date().toISOString() });
  }

  /**
   * Log a debug message
   * @param message - The log message
   * @param meta - Additional metadata
   */
  debug(message: string, meta: Record<string, any> = {}) {
    this.logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
  }

  /**
   * Log an HTTP request
   * @param message - The log message
   * @param meta - Additional metadata
   */
  http(message: string, meta: Record<string, any> = {}) {
    this.logger.http(message, { ...meta, timestamp: new Date().toISOString() });
  }

  /**
   * Stream for use with Morgan HTTP logger middleware
   */
  get stream() {
    return {
      write: (message: string) => {
        const msg = message.trim();
        this.http(msg);
      }
    };
  }
}
