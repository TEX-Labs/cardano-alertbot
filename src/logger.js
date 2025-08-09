/**
 * Application logger using pino.
 * Use logger.info / logger.warn / logger.error for structured logs.
 */
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});
