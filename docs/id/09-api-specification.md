# 09. Spesifikasi REST API (`apps/server`)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [05-adr.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/05-adr.md), [07-database-design.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/07-database-design.md)  

---

## 1. Peran REST API vs WebSocket
Meskipun seluruh interaksi real-time saat pertandingan berlangsung ditangani oleh **Native WebSocket (`/ws`)**, kita menggunakan endpoint **HTTP REST API (Fastify)** untuk:
1. Pembuatan Room awal (`Create Room`).
2. Pemeriksaan dan validasi keberadaan room sebelum klien membuka koneksi WebSocket (`Join Room Pre-check`).
3. Pemeriksaan status server & statistik node (`Health Check & Metrics`).

---

## 2. Integrasi Zod Validator pada Fastify (`ADR-007`)
Untuk menjamin keamanan tipe (*type-safety*) antara skema request/response HTTP dan route Fastify, kita menggunakan **`fastify-type-provider-zod`**. Skema Zod yang dideklarasikan akan otomatis memvalidasi request body, parameters, serta merender spesifikasi **OpenAPI / Swagger** secara otomatis.

---

## 3. Spesifikasi Endpoints MVP

### 3.1 `POST /api/v1/rooms` (Create Room)
Membuat room baru di dalam memori (`RoomManager`) dan mencatat log inisiasi di PostgreSQL via Drizzle ORM.

- **Request Body Schema (`Zod`):**
  ```typescript
  import { z } from 'zod';

  export const CreateRoomRequestSchema = z.object({
    hostNickname: z.string().min(2).max(50),
    gameMode: z.enum(['1v1', 'FFA', 'BATTLE_ROYALE', 'TEAM_2V2', 'TEAM_5V5']).default('1v1'),
    settings: z.object({
      timeLimit: z.number().int().min(15).max(300).default(60),
      wordSource: z.string().default('id_standard'),
      difficulty: z.enum(['easy', 'normal', 'hard']).default('normal'),
      theme: z.enum(['fighting', 'racing']).default('fighting'),
      skillSystem: z.boolean().default(true),
    }).optional(),
  });
  ```
- **Response `201 Created` Schema (`Zod`):**
  ```typescript
  export const CreateRoomResponseSchema = z.object({
    success: z.literal(true),
    data: z.object({
      roomId: z.string().uuid(),
      roomCode: z.string(), // Contoh: 'FT-9823'
      wsUrl: z.string(),    // Contoh: 'ws://localhost:3000/ws?room=FT-9823'
      expiresAt: z.string().datetime(),
    }),
  });
  ```

---

### 3.2 `GET /api/v1/rooms/:code` (Check Room Status)
Memeriksa status room sebelum pemain masuk ke lobi.

- **Request Params Schema (`Zod`):**
  ```typescript
  export const CheckRoomParamsSchema = z.object({
    code: z.string().min(3).max(20).regex(/^[A-Z0-9-]+$/),
  });
  ```
- **Response `200 OK` Schema (`Zod`):**
  ```typescript
  export const CheckRoomResponseSchema = z.object({
    success: z.literal(true),
    data: z.object({
      roomCode: z.string(),
      status: z.enum(['LOBBY', 'IN_PROGRESS', 'FINISHED']),
      hostNickname: z.string(),
      playerCount: z.number().int().nonnegative(),
      maxPlayers: z.number().int().positive(),
      gameMode: z.string(),
    }),
  });
  ```
- **Response `404 Not Found` Schema (`Zod`):**
  ```typescript
  export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }),
  });
  ```

---

### 3.3 `GET /health` (Server Health Check)
Digunakan oleh container orchestration (`Docker` / Load Balancer) untuk memverifikasi status hidup server.

- **Response `200 OK` Schema (`Zod`):**
  ```typescript
  export const HealthCheckResponseSchema = z.object({
    status: z.literal('OK'),
    uptimeSeconds: z.number(),
    activeRooms: z.number().int().nonnegative(),
    activeWsConnections: z.number().int().nonnegative(),
  });
  ```

---

## 4. Pola Implementasi Route Handler dengan Neverthrow (`ADR-008`)
Seluruh route Fastify diproses secara fungsional. Apabila terjadi kegagalan dari *Service/Domain Layer*, hasil `Err<DomainError>` diterjemahkan menjadi response HTTP yang sesuai tanpa melempar exception (`try/catch`):

```typescript
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { RoomService } from '../services/room-service';
import { CreateRoomRequestSchema, CreateRoomResponseSchema, ErrorResponseSchema } from './schemas';

export const roomRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    '/rooms',
    {
      schema: {
        body: CreateRoomRequestSchema,
        response: {
          201: CreateRoomResponseSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      // Panggil service yang mengembalikan ResultAsync<RoomData, RoomServiceError>
      const result = await RoomService.createRoom(request.body);

      if (result.isErr()) {
        const error = result.error;
        fastify.log.error({ err: error }, 'Gagal membuat room');

        return reply.status(error.statusCode || 500).send({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
      }

      const roomData = result.value;
      return reply.status(201).send({
        success: true,
        data: roomData,
      });
    }
  );
};
```
