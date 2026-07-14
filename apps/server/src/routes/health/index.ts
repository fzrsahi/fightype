import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { HTTP_STATUS } from '@fightype/shared';

export const healthRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/health',
    {
      schema: {
        response: {
          [HTTP_STATUS.OK]: z.object({
            status: z.literal('OK'),
            uptimeSeconds: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(HTTP_STATUS.OK).send({
        status: 'OK',
        uptimeSeconds: Math.round(process.uptime()),
      });
    }
  );
};
