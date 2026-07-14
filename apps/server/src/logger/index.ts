import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export function createLogger(name: string) {
  return pino({
    name,
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true,
          },
        }
      : undefined,
  });
}

export const logger = createLogger('FighType:Server');
