import { config } from 'dotenv';

config();

/**
 * Logger configuration settings based on environment variables
 */
export const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  logDir: process.env.LOG_DIR || 'logs',
  environment: process.env.NODE_ENV || 'development',
  service: process.env.SERVICE_NAME || 'inversify-fastify-app',
  maxSize: process.env.LOG_MAX_SIZE || '20m',
  maxFiles: process.env.LOG_MAX_FILES || '14d',
  prettyPrint: process.env.NODE_ENV === 'development'
};

/**
 * Log levels with priorities
 */
export const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

/**
 * Get the log level based on the environment
 */
export const getLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? 'info' : 'debug';
};
