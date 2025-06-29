import { format, transports } from 'winston';
import { loggerConfig } from '../logger.config.js';

const { combine, timestamp, printf, colorize } = format;

/**
 * Custom format for console logs
 */
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

/**
 * Console transport configuration for Winston
 */
export const consoleTransport = new transports.Console({
  level: loggerConfig.level,
  format: consoleFormat
});
