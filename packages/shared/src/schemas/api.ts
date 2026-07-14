import { z } from "zod";
import { GAME_RULES } from "../constants";

export const CreateRoomRequestSchema = z.object({
  hostNickname: z.string().min(2).max(50),
  gameMode: z
    .enum(["1v1", "FFA", "BATTLE_ROYALE", "TEAM_2V2", "TEAM_5V5"])
    .default("1v1"),
  settings: z
    .object({
      timeLimit: z
        .number()
        .int()
        .min(15)
        .max(300)
        .default(GAME_RULES.DEFAULT_TIME_LIMIT_SECONDS),
      wordSource: z.string().default("id_standard"),
      difficulty: z.enum(["easy", "normal", "hard"]).default("normal"),
      theme: z.enum(["fighting", "racing"]).default("fighting"),
      skillSystem: z.boolean().default(true),
    })
    .optional(),
});

export type CreateRoomRequest = z.infer<typeof CreateRoomRequestSchema>;

export const CreateRoomResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    roomId: z.string().uuid(),
    roomCode: z.string(),
    wsUrl: z.string(),
    expiresAt: z.string().datetime(),
  }),
});

export type CreateRoomResponse = z.infer<typeof CreateRoomResponseSchema>;

export const CheckRoomParamsSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9-]+$/),
});

export type CheckRoomParams = z.infer<typeof CheckRoomParamsSchema>;

export const CheckRoomResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    roomCode: z.string(),
    status: z.enum(["LOBBY", "IN_PROGRESS", "FINISHED"]),
    hostNickname: z.string(),
    playerCount: z.number().int().nonnegative(),
    maxPlayers: z.number().int().positive(),
    gameMode: z.string(),
  }),
});

export type CheckRoomResponse = z.infer<typeof CheckRoomResponseSchema>;

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
