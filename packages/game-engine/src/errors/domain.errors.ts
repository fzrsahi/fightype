import { HTTP_STATUS, ERROR_CODES } from '@fightype/shared';

export abstract class DomainError {
  abstract readonly statusCode: number;
  abstract readonly errorCode: string;
  abstract readonly message: string;

  toResponse() {
    return {
      success: false as const,
      error: {
        code: this.errorCode,
        message: this.message,
      },
    };
  }
}

export class InvalidTypingInputError extends DomainError {
  readonly statusCode = HTTP_STATUS.BAD_REQUEST;
  readonly errorCode = ERROR_CODES.INVALID_PAYLOAD;
  readonly message: string;

  constructor(reason: string) {
    super();
    this.message = `Invalid typing input received: ${reason}.`;
  }
}

export class RoomNotFoundError extends DomainError {
  readonly statusCode = HTTP_STATUS.NOT_FOUND;
  readonly errorCode = ERROR_CODES.ROOM_NOT_FOUND;
  readonly message: string;

  constructor(code: string) {
    super();
    this.message = `Room with code '${code}' was not found.`;
  }
}

export class RoomFullError extends DomainError {
  readonly statusCode = HTTP_STATUS.BAD_REQUEST;
  readonly errorCode = ERROR_CODES.ROOM_FULL;
  readonly message: string;

  constructor(maxPlayers: number) {
    super();
    this.message = `Room has reached its maximum player capacity of ${maxPlayers}.`;
  }
}

export class InvalidRoomStatusError extends DomainError {
  readonly statusCode = HTTP_STATUS.BAD_REQUEST;
  readonly errorCode = ERROR_CODES.INVALID_ROOM_STATUS;
  readonly message: string;

  constructor(currentStatus: string, expectedStatus: string) {
    super();
    this.message = `Cannot perform action in status '${currentStatus}'. Expected status '${expectedStatus}'.`;
  }
}
