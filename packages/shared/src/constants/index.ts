export const ERROR_CODES = {
  ROOM_NOT_FOUND: 'ERR_ROOM_NOT_FOUND',
  ROOM_FULL: 'ERR_ROOM_FULL',
  INVALID_ROOM_STATUS: 'ERR_INVALID_ROOM_STATUS',
  UNAUTHORIZED: 'ERR_UNAUTHORIZED',
  INVALID_PAYLOAD: 'ERR_INVALID_PAYLOAD',
  INTERNAL_SERVER_ERROR: 'ERR_INTERNAL_SERVER_ERROR',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const GAME_RULES = {
  MAX_PLAYERS_PER_ROOM: 10,
  MIN_PLAYERS_TO_START: 2,
  TICK_RATE_HZ: 20,
  TICK_INTERVAL_MS: 50,
  DEFAULT_TIME_LIMIT_SECONDS: 60,
  BATTLE_ROYALE_ELIMINATION_INTERVAL_SECONDS: 15,
} as const;

export const DICTIONARIES_ID_BASIC = [
  'terbang', 'pedang', 'menang', 'cepat', 'cahaya', 'gelap', 'badai',
  'ksatria', 'naga', 'perisai', 'serangan', 'bertahan', 'kekuatan',
  'raja', 'ratu', 'hutan', 'gunung', 'lautan', 'api', 'air',
  'angin', 'petir', 'bayangan', 'waktu', 'ruang', 'jiwa', 'langit'
];
