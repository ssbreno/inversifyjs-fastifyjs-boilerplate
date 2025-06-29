import { randomUUID } from 'crypto';

/**
 * Generate a unique request ID
 * @returns a UUID string
 */
export function generateRequestId(): string {
  return randomUUID();
}

/**
 * Format a log object for output
 * @param data - Object to format
 * @returns Formatted string
 */
export function formatLogObject(data: Record<string, any>): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Sanitize sensitive data from logs
 * @param obj - Object to sanitize
 * @param sensitiveKeys - Array of keys to sanitize
 * @returns Sanitized object
 */
export function sanitizeData(obj: Record<string, any>, sensitiveKeys: string[] = ['password', 'token', 'authorization', 'secret']): Record<string, any> {
  const result = { ...obj };
  
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        result[key] = '[REDACTED]';
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = sanitizeData(result[key], sensitiveKeys);
      }
    }
  }
  
  return result;
}
