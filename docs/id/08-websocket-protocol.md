# 08. Protokol WebSocket & Skema Komunikasi (`packages/shared`)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [04-tdd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/04-tdd.md), [05-adr.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/05-adr.md)  

---

## 1. Arsitektur Komunikasi Real-Time (Fastify + Native WebSocket)
Komunikasi dalam room **FighType** berjalan di atas **Native WebSocket (`/ws`)**. Untuk menjaga performa tinggi dan keamanan tipe data, seluruh paket komunikasi distandarisasi dan divalidasi menggunakan **Zod (`ADR-007`)** di dalam paket `packages/shared`.

---

## 2. Skema Zod untuk Paket Client-to-Server (C2S)
Paket yang dikirimkan oleh klien ke server harus memenuhi skema `ClientPacketSchema` di bawah ini. Jika paket tidak lolos validasi Zod, server langsung menolak pesan tersebut tanpa menyebabkan crash.

```typescript
import { z } from 'zod';

export const C2S_RoomJoinSchema = z.object({
  type: z.literal('ROOM_JOIN'),
  payload: z.object({
    roomCode: z.string().min(3).max(20),
    nickname: z.string().min(2).max(50),
  }),
});

export const C2S_RoomReadySchema = z.object({
  type: z.literal('ROOM_READY'),
  payload: z.object({
    isReady: z.boolean(),
  }),
});

export const C2S_RoomStartSchema = z.object({
  type: z.literal('ROOM_START'),
});

export const C2S_TypingInputSchema = z.object({
  type: z.literal('TYPING_INPUT'),
  payload: z.object({
    wordIndex: z.number().int().nonnegative(),
    charIndex: z.number().int().nonnegative(),
    isCorrect: z.boolean(),
    clientTimestamp: z.number().int().positive(),
  }),
});

export const ClientPacketSchema = z.discriminatedUnion('type', [
  C2S_RoomJoinSchema,
  C2S_RoomReadySchema,
  C2S_RoomStartSchema,
  C2S_TypingInputSchema,
]);

export type ClientPacket = z.infer<typeof ClientPacketSchema>;
```

---

## 3. Skema Zod untuk Paket Server-to-Client (S2C Broadcast)
Server secara rutin mem-broadcast paket kepada klien. Paket utama adalah `ROOM_STATE_TICK` yang dipancarkan pada **frekuensi 20Hz (setiap 50ms)** untuk menjaga sinkronisasi posisi pemain dan HP, serta paket *event-driven* seketika untuk animasi skill.

```typescript
import { z } from 'zod';

export const PlayerStateSchema = z.object({
  userId: z.string().uuid(),
  nickname: z.string(),
  isReady: z.boolean(),
  isEliminated: z.boolean(),
  hpPercent: z.number().min(0).max(100),
  grossWpm: z.number().nonnegative(),
  netWpm: z.number().nonnegative(),
  accuracy: z.number().min(0).max(100),
  combo: z.number().int().nonnegative(),
  currentWordIndex: z.number().int().nonnegative(),
  activeDebuffs: z.array(z.string()), // Contoh: ['SMOKE', 'CONFUSE']
});

export const S2C_RoomStateTickSchema = z.object({
  type: z.literal('ROOM_STATE_TICK'),
  payload: z.object({
    roomCode: z.string(),
    serverTimestamp: z.number().int().positive(),
    status: z.enum(['LOBBY', 'COUNTDOWN', 'IN_PROGRESS', 'FINISHED']),
    players: z.array(PlayerStateSchema),
  }),
});

export const S2C_SkillTriggeredSchema = z.object({
  type: z.literal('SKILL_TRIGGERED'),
  payload: z.object({
    skillName: z.enum(['COMBO_ATTACK', 'CRITICAL', 'CONFUSE', 'MIRROR', 'SMOKE', 'LIGHTNING', 'WIND', 'GHOST', 'FREEZE']),
    sourceUserId: z.string().uuid(),
    targetUserId: z.string().uuid(),
    durationMs: z.number().int().nonnegative(),
  }),
});

export const S2C_PlayerEliminatedSchema = z.object({
  type: z.literal('PLAYER_ELIMINATED'),
  payload: z.object({
    userId: z.string().uuid(),
    reason: z.enum(['LOWEST_WPM', 'ACCURACY_DROP', 'DISCONNECTED']),
  }),
});

export const S2C_MatchOverSchema = z.object({
  type: z.literal('MATCH_OVER'),
  payload: z.object({
    winnerUserId: z.string().uuid(),
    finalStandings: z.array(
      z.object({
        userId: z.string().uuid(),
        nickname: z.string(),
        placement: z.number().int().positive(),
        netWpm: z.number(),
        accuracy: z.number(),
      })
    ),
  }),
});

export const ServerPacketSchema = z.discriminatedUnion('type', [
  S2C_RoomStateTickSchema,
  S2C_SkillTriggeredSchema,
  S2C_PlayerEliminatedSchema,
  S2C_MatchOverSchema,
]);

export type ServerPacket = z.infer<typeof ServerPacketSchema>;
```

---

## 4. Pemrosesan Pesan Masuk Secara Functional (`neverthrow` + `Zod`)
Sesuai **ADR-007** dan **ADR-008**, seluruh pesan yang diterima server WebSocket (`apps/server/src/net/ws-handler.ts`) diparsing secara fungsional tanpa `try/catch` untuk menjamin keamanan dari *malformed packet*:

```typescript
import { Result, ok, err } from 'neverthrow';
import { ClientPacketSchema, ClientPacket } from 'shared/protocol';

export type PacketParseError = {
  type: 'INVALID_JSON' | 'INVALID_SCHEMA';
  message: string;
  details?: unknown;
};

/**
 * Memparsing raw string WebSocket menjadi ClientPacket type-safe.
 */
export function parseIncomingPacket(rawMessage: string): Result<ClientPacket, PacketParseError> {
  // 1. Parsing JSON string
  const jsonResult = Result.fromThrowable(
    () => JSON.parse(rawMessage),
    (error) => ({
      type: 'INVALID_JSON' as const,
      message: 'Format pesan harus berupa JSON yang valid',
      details: error,
    })
  )();

  if (jsonResult.isErr()) {
    return err(jsonResult.error);
  }

  // 2. Validasi skema Zod
  const validation = ClientPacketSchema.safeParse(jsonResult.value);
  if (!validation.success) {
    return err({
      type: 'INVALID_SCHEMA' as const,
      message: 'Struktur payload WebSocket tidak sesuai protokol',
      details: validation.error.format(),
    });
  }

  return ok(validation.data);
}
```
