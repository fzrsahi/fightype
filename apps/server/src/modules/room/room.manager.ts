import { GAME_RULES, type CreateRoomRequest } from '@fightype/shared';
import { createLogger } from '../../logger';

const logger = createLogger('RoomManager');

export interface RoomSession {
  roomId: string;
  roomCode: string;
  hostNickname: string;
  gameMode: string;
  status: 'LOBBY' | 'IN_PROGRESS' | 'FINISHED';
  players: {
    userId: string;
    nickname: string;
    isReady: boolean;
  }[];
  maxPlayers: number;
  createdAt: number;
}

export class RoomManager {
  private static rooms = new Map<string, RoomSession>();

  static createRoom(code: string, payload: CreateRoomRequest): RoomSession {
    const roomId = crypto.randomUUID();
    const session: RoomSession = {
      roomId,
      roomCode: code,
      hostNickname: payload.hostNickname,
      gameMode: payload.gameMode,
      status: 'LOBBY',
      players: [
        {
          userId: crypto.randomUUID(),
          nickname: payload.hostNickname,
          isReady: true,
        },
      ],
      maxPlayers: GAME_RULES.MAX_PLAYERS_PER_ROOM,
      createdAt: Date.now(),
    };
    this.rooms.set(code, session);
    logger.info({ roomCode: code, roomId, host: payload.hostNickname, gameMode: payload.gameMode }, 'Room created successfully');
    return session;
  }

  static getRoom(code: string): RoomSession | undefined {
    const session = this.rooms.get(code);
    if (!session) {
      logger.debug({ roomCode: code }, 'Room search failed: room not found in active sessions');
    }
    return session;
  }

  static generateUniqueCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (this.rooms.has(code)) {
      return this.generateUniqueCode();
    }
    return code;
  }
}
