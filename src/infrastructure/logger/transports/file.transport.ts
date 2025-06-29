import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { loggerConfig } from '../logger.config.js';

const { combine, timestamp, json } = format;

const logDir = loggerConfig.logDir;
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

/**
 * Common format for file transports
 */
const fileFormat = combine(
  timestamp(),
  json()
);

/**
 * Creates a daily rotate file transport for specific log level
 * @param level - Log level to filter
 */
const createDailyRotateTransport = (level: string) => {
  return new DailyRotateFile({
    level,
    filename: join(logDir, `%DATE%-${level}.log`),
    datePattern: 'YYYY-MM-DD',
    maxSize: loggerConfig.maxSize,
    maxFiles: loggerConfig.maxFiles,
    format: fileFormat,
    zippedArchive: true
  });
};

export const fileTransports = [
  new DailyRotateFile({
    filename: join(logDir, '%DATE%-combined.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: loggerConfig.maxSize,
    maxFiles: loggerConfig.maxFiles,
    format: fileFormat,
    zippedArchive: true
  }),
  createDailyRotateTransport('error'),
  createDailyRotateTransport('info')
];
