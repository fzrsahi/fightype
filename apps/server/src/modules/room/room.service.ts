import { ResultAsync } from 'neverthrow';
import type { CreateRoomRequest, CreateRoomResponse } from '@fightype/shared';
import { RoomNotFoundError, DomainError } from '@fightype/game-engine';
import { RoomManager, type RoomSession } from './room.manager';
import { createLogger } from '../../logger';

const logger = createLogger('RoomService');

export class RoomService {
  static createRoom(payload: CreateRoomRequest): ResultAsync<CreateRoomResponse['data'], DomainError> {
    return ResultAsync.fromPromise(
      ((async () => {
        const code = RoomManager.generateUniqueCode();
        const session = RoomManager.createRoom(code, payload);
        logger.info({ roomCode: session.roomCode, host: payload.hostNickname }, 'Room service generated new room session');
        return {
          roomId: session.roomId,
          roomCode: session.roomCode,
          wsUrl: `ws://localhost:3000/ws?room=${session.roomCode}`,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        };
      })()),
      (e) => {
        logger.error({ err: e }, 'Unexpected failure during room creation');
        return e as DomainError;
      }
    );
  }

  static getRoomStatus(code: string): ResultAsync<RoomSession, DomainError> {
    return ResultAsync.fromPromise(
      ((async () => {
        const session = RoomManager.getRoom(code);
        if (!session) {
          logger.debug({ roomCode: code }, 'Room status check encountered missing room');
          throw new RoomNotFoundError(code);
        }
        return session;
      })()),
      (e) => {
        if (e instanceof DomainError) {
          return e;
        }
        logger.error({ err: e, roomCode: code }, 'Unexpected error retrieving room status');
        return new RoomNotFoundError(code);
      }
    );
  }
}
