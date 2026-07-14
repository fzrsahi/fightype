import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { corsPlugin } from './plugins/cors';
import { swaggerPlugin } from './plugins/swagger';
import { healthRoutes } from './routes/health';
import { roomRoutes } from './routes/api/rooms';

const isDev = process.env.NODE_ENV !== 'production';

export async function buildApp() {
  const app = fastify({
    logger: isDev
      ? {
          level: process.env.LOG_LEVEL || 'debug',
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              colorize: true,
            },
          },
        }
      : {
          level: process.env.LOG_LEVEL || 'info',
        },
  }).withTypeProvider<ZodTypeProvider>();

  // Register Zod compiler hooks
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Register plugins
  await app.register(corsPlugin);
  await app.register(swaggerPlugin);

  // Register routes
  await app.register(healthRoutes);
  await app.register(roomRoutes, { prefix: '/api/v1/rooms' });

  return app;
}
