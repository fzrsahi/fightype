import { z } from 'zod';

// ==========================================
// CLIENT -> SERVER PACKETS (C2S)
// ==========================================

export const C2S_RoomJoinSchema = z.object({
  type: z.literal('ROOM_JOIN'),
  roomCode: z.string().min(3),
  nickname: z.string().min(2).max(50),
});

export const C2S_RoomReadySchema = z.object({
  type: z.literal('ROOM_READY'),
  isReady: z.boolean(),
});

export const C2S_TypingInputSchema = z.object({
  type: z.literal('TYPING_INPUT'),
  charIndex: z.number().int().nonnegative(),
  typedChar: z.string().length(1),
  timestamp: z.number().int().positive(),
});

export const ClientPacketSchema = z.discriminatedUnion('type', [
  C2S_RoomJoinSchema,
  C2S_RoomReadySchema,
  C2S_TypingInputSchema,
]);

export type ClientPacket = z.infer<typeof ClientPacketSchema>;

// ==========================================
// SERVER -> CLIENT PACKETS (S2C)
// ==========================================

export const PlayerStateSchema = z.object({
  userId: z.string(),
  nickname: z.string(),
  isReady: z.boolean(),
  progress: z.number().min(0).max(100),
  wpm: z.number().nonnegative(),
  accuracy: z.number().min(0).max(100),
  combo: z.number().int().nonnegative(),
  hp: z.number().min(0).max(100),
  status: z.enum(['ACTIVE', 'ELIMINATED', 'SPECTATOR']),
});

export type PlayerState = z.infer<typeof PlayerStateSchema>;

export const S2C_RoomStateTickSchema = z.object({
  type: z.literal('ROOM_STATE_TICK'),
  serverTime: z.number(),
  roomStatus: z.enum(['LOBBY', 'COUNTDOWN', 'IN_PROGRESS', 'FINISHED']),
  players: z.array(PlayerStateSchema),
});

export const S2C_SkillTriggeredSchema = z.object({
  type: z.literal('SKILL_TRIGGERED'),
  sourceUserId: z.string(),
  targetUserId: z.string(),
  skillId: z.enum(['COMBO_ATTACK', 'CRITICAL', 'CONFUSE', 'MIRROR', 'SMOKE', 'LIGHTNING', 'WIND', 'GHOST', 'FREEZE']),
  durationMs: z.number().int().nonnegative(),
});

export const S2C_MatchEndSchema = z.object({
  type: z.literal('MATCH_END'),
  winnerUserId: z.string().nullable(),
  finalStandings: z.array(PlayerStateSchema),
});

export const ServerPacketSchema = z.discriminatedUnion('type', [
  S2C_RoomStateTickSchema,
  S2C_SkillTriggeredSchema,
  S2C_MatchEndSchema,
]);

export type ServerPacket = z.infer<typeof ServerPacketSchema>;
