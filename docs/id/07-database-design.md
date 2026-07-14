# 07. Desain Database Relasional (Database Design - Drizzle ORM + PostgreSQL)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [02-prd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/02-prd.md), [05-adr.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/05-adr.md)  

---

## 1. Skema & Model Persistensi Relasional (PostgreSQL)
Meskipun MVP **FighType** berjalan secara *real-time in-memory* (melalui WebSocket dan `RoomManager`), kita mencatat riwayat sesi room, konfigurasi match, dan hasil akhir pertandingan ke database PostgreSQL melalui **Drizzle ORM** untuk analisis statistik dan fondasi perluasan fitur masa depan (akun, ranking, turnamen).

Skema ini dirancang *future-proof* dengan *zero breaking migrations*.

### 1.1 Diagram Relasi Tabel (ERD / Entity Relationship)
```
+-------------------+        +-------------------+        +------------------------+
|       users       |        |       rooms       |        |        matches         |
+-------------------+        +-------------------+        +------------------------+
| id (PK, UUID)     |        | id (PK, UUID)     |        | id (PK, UUID)          |
| username          |        | code (Unique)     |<-------| room_id (FK)           |
| created_at        |        | host_nickname     |        | game_mode              |
+-------------------+        | status            |        | settings_json (JSONB)  |
         ^                   | created_at        |        | start_time, end_time   |
         |                   +-------------------+        +------------------------+
         |                                                            ^
         +----------------------------+                               |
                                      |                               |
                               +---------------------------------------------+
                               |              match_participants             |
                               +---------------------------------------------+
                               | id (PK, UUID)                               |
                               | match_id (FK)                               |
                               | user_id (FK, nullable untuk guest)          |
                               | nickname                                    |
                               | gross_wpm, net_wpm, accuracy                |
                               | max_combo, placement, is_winner             |
                               +---------------------------------------------+
```

---

## 2. Definisi Skema Drizzle ORM (`schema.ts`)
Berikut adalah definisi skema database strict TypeScript menggunakan **Drizzle ORM** (`drizzle-orm/pg-core`):

```typescript
import { pgTable, uuid, varchar, timestamp, integer, boolean, jsonb, real } from 'drizzle-orm/pg-core';

// Tabel Users (Persiapan untuk fitur autentikasi pasca-MVP)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabel Rooms (Riwayat sesi ruang lobi)
export const rooms = pgTable('rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 20 }).notNull().unique(), // Contoh: 'FT-9823'
  hostNickname: varchar('host_nickname', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('LOBBY').notNull(), // LOBBY, IN_PROGRESS, FINISHED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabel Matches (Catatan pertandingan yang dimulai)
export const matches = pgTable('matches', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: uuid('room_id').references(() => rooms.id).notNull(),
  gameMode: varchar('game_mode', { length: 30 }).notNull(), // 1v1, FFA, BATTLE_ROYALE, TEAM_2V2, TEAM_5V5
  settings: jsonb('settings').notNull(), // Menyimpan konfigurasi: timeLimit, wordSource, difficulty, theme
  startTime: timestamp('start_time').defaultNow().notNull(),
  endTime: timestamp('end_time'),
});

// Tabel Match Participants (Hasil akhir masing-masing peserta dalam pertandingan)
export const matchParticipants = pgTable('match_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  matchId: uuid('match_id').references(() => matches.id).notNull(),
  userId: uuid('user_id').references(() => users.id), // Nullable jika pemain bertanding sebagai Guest
  nickname: varchar('nickname', { length: 50 }).notNull(),
  grossWpm: integer('gross_wpm').notNull(),
  netWpm: integer('net_wpm').notNull(),
  accuracy: real('accuracy').notNull(), // Contoh: 98.4
  maxCombo: integer('max_combo').notNull(),
  placement: integer('placement').notNull(), // Peringkat akhir (1 = Juara)
  isWinner: boolean('is_winner').default(false).notNull(),
});
```

---

## 3. Integrasi Zod Schema untuk Validasi Skema ORM (`ADR-007`)
Menggunakan **Zod** (`drizzle-zod` atau skema Zod eksplisit) untuk memastikan keamanan tipe saat penyisipan data dari payload API:

```typescript
import { z } from 'zod';

export const insertRoomSchema = z.object({
  code: z.string().min(3).max(20).regex(/^[A-Z0-9-]+$/),
  hostNickname: z.string().min(2).max(50),
});

export const insertMatchSchema = z.object({
  roomId: z.string().uuid(),
  gameMode: z.enum(['1v1', 'FFA', 'BATTLE_ROYALE', 'TEAM_2V2', 'TEAM_5V5']),
  settings: z.object({
    timeLimit: z.number().int().positive(),
    wordSource: z.string(),
    difficulty: z.enum(['easy', 'normal', 'hard']),
    theme: z.enum(['fighting', 'racing']),
  }),
});

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
```

---

## 4. Akses Database Functional dengan Neverthrow (`ADR-008`)
Setiap operasi database (`apps/server/src/db/repository`) dibungkus menggunakan **neverthrow (`ResultAsync`)** untuk menjamin tidak ada *unhandled promise rejection* atau *silent SQL failure*:

```typescript
import { ResultAsync } from 'neverthrow';
import { db } from './connection';
import { rooms, InsertRoom } from './schema';

export type DatabaseError = {
  type: 'DATABASE_ERROR';
  message: string;
  cause?: unknown;
};

export class RoomRepository {
  /**
   * Membuat record room baru di database secara fungsional.
   * Mengembalikan `ResultAsync<RoomRecord, DatabaseError>`
   */
  static createRoom(data: InsertRoom): ResultAsync<typeof rooms.$inferSelect, DatabaseError> {
    return ResultAsync.fromPromise(
      db.insert(rooms).values(data).returning().then((rows) => rows[0]!),
      (error) => ({
        type: 'DATABASE_ERROR',
        message: 'Gagal membuat record room baru di PostgreSQL',
        cause: error,
      })
    );
  }
}
```
