import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  CreateRoomRequestSchema,
  CreateRoomResponseSchema,
  CheckRoomParamsSchema,
  CheckRoomResponseSchema,
  ApiErrorResponseSchema,
  HTTP_STATUS,
} from '@fightype/shared';
import { RoomService } from '../../../modules/room/room.service';

export const roomRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: {
        body: CreateRoomRequestSchema,
        response: {
          [HTTP_STATUS.CREATED]: CreateRoomResponseSchema,
          [HTTP_STATUS.BAD_REQUEST]: ApiErrorResponseSchema,
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ApiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await RoomService.createRoom(request.body);

      if (result.isErr()) {
        const domainError = result.error;
        return reply.status(domainError.statusCode as any).send(domainError.toResponse());
      }

      return reply.status(HTTP_STATUS.CREATED).send({
        success: true,
        data: result.value,
      });
    }
  );

  fastify.get(
    '/:code',
    {
      schema: {
        params: CheckRoomParamsSchema,
        response: {
          [HTTP_STATUS.OK]: CheckRoomResponseSchema,
          [HTTP_STATUS.NOT_FOUND]: ApiErrorResponseSchema,
          [HTTP_STATUS.BAD_REQUEST]: ApiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await RoomService.getRoomStatus(request.params.code);

      if (result.isErr()) {
        const domainError = result.error;
        return reply.status(domainError.statusCode as any).send(domainError.toResponse());
      }

      const session = result.value;
      return reply.status(HTTP_STATUS.OK).send({
        success: true,
        data: {
          roomCode: session.roomCode,
          status: session.status,
          hostNickname: session.hostNickname,
          playerCount: session.players.length,
          maxPlayers: session.maxPlayers,
          gameMode: session.gameMode,
        },
      });
    }
  );
};
