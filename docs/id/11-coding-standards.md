# 11. Standar Penulisan Kode (Coding Standards & Engineering Guidelines)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [05-adr.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/05-adr.md), [10-folder-structure.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/10-folder-structure.md)  

---

## 1. Filosofi & Kepatuhan Terhadap Framework
Sesuai aturan utama kita: **"Jangan membuat struktur yang melawan framework"**. Setiap developer yang berkontribusi pada FighType wajib mematuhi konvensi idiomatik dari masing-masing teknologi penopang:
1. **`apps/server` (Fastify):** Wajib memanfaatkan pola arsitektur **Fastify Plugin (`fastify.register`)**, enkapsulasi context per route, dekorator tipe-aman (`fastify.db`), serta validasi skema via `fastify-type-provider-zod`.
2. **`apps/web` (React + Vite):** Wajib memanfaatkan **Functional Components**, **React Hooks**, serta pemisahan state lokal/global (`Zustand`) tanpa merusak konvensi hierarki komponen React.
3. **`packages/game-engine`:** Wajib ditulis sebagai **Pure Functions (Determinis)**. Tidak boleh ada pemanggilan API browser (`window`, `document`) ataupun Node/server (`fs`, `fastify`).

---

## 2. Aturan & Konfigurasi TypeScript `v7.0.2` (`Framework-Tailored Workspaces`)
Sesuai **ADR-010** dan prinsip *"Jangan membuat struktur melawan framework"*, seluruh monorepo dipatok menggunakan **TypeScript `v7.0.2` (`"typescript": "^7.0.2"`)**. Setiap aplikasi dan paket memiliki `tsconfig.json` yang diturunkan dari base strict dan disesuaikan (*tailored*) dengan lingkungan frameworknya:

### 2.1 Konfigurasi Root Strict Base (`/tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 2.2 Konfigurasi Backend Fastify + Bun (`apps/server/tsconfig.json`)
Disesuaikan untuk eksekusi server-side Bun dengan dukungan top-level await dan Fastify plugins:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["bun-types"],
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

### 2.3 Konfigurasi Frontend React + Vite (`apps/web/tsconfig.json`)
Disesuaikan dengan standar konvensi Vite untuk JSX transform modern (`react-jsx`) dan akses DOM:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src/**/*", "vite.config.ts"]
}
```

### 2.4 Konfigurasi Shared Domain Packages (`packages/*/tsconfig.json`)
Dikonfigurasi sebagai *composite project references* agar di-compile sekali dan dapat diimpor secara langsung:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"]
}
```

### 2.5 Konvensi Penamaan Ekstensi & Simbol
- Gunakan file `.ts` untuk logika/domain murni dan `.tsx` untuk komponen React.
- `camelCase` untuk variabel, fungsi, properti objek (`typingEngine.ts`, `calculateWpm()`).
- `PascalCase` untuk Class, Interface, Type Alias, Zod Schema, dan Komponen React (`RoomManager`, `ClientPacketSchema`, `TypingArea.tsx`).
- `UPPER_SNAKE_CASE` untuk konstanta global (`MAX_ROOM_PLAYERS = 10`, `TICK_RATE_HZ = 20`).

---

## 3. Standar Validasi Menggunakan Zod (`ADR-007`)
1. **Single Source of Truth untuk Skema:** Seluruh definisi payload jaringan, request API, dan skema lingkungan wajib dideklarasikan terlebih dahulu dalam bentuk **Zod Schema (`z.object(...)`)** di `packages/shared/src/schemas` atau `protocol`.
2. **Derivasi Tipe Otomatis:** Dilarang membuat `interface` atau `type` manual yang menduplikasi skema Zod. Gunakan selalu:
   ```typescript
   export const RoomJoinPayloadSchema = z.object({
     roomCode: z.string().min(3),
     nickname: z.string().min(2),
   });
   export type RoomJoinPayload = z.infer<typeof RoomJoinPayloadSchema>;
   ```
3. **Validasi Runtime Aman:** Gunakan `schema.safeParse(data)` saat memproses data eksternal di luar route Fastify otomatis (seperti pada *message handler WebSocket* di `ws.handler.ts`).

---

## 4. Standar Functional Error Handling dengan Neverthrow (`ADR-008`)
Kita **menolak penggunaan `try / catch` konvensional** untuk alur logika bisnis yang dapat diprediksi kegagalannya (*expected domain errors* seperti "Room penuh", "Kode room tidak ditemukan", atau "Payload WebSocket tidak valid").

### 4.1 Aturan Pengembalian Fungsi (`Result<T, E>` / `ResultAsync<T, E>`)
Setiap fungsi domain atau repository yang berpotensi gagal wajib mengembalikan objek `Result` dari library `neverthrow`:
---

## 4. Desentralisasi Error Handling dengan Neverthrow (`ADR-008` & `ADR-009`)
Kita **menolak keras penggunaan pencocokan string terpusat (`error.type === 'ROOM_NOT_FOUND'`) ataupun `try / catch` konvensional**. Setiap error domain dikelola secara **desentralisasi (*Decentralized Error Handling*)** di mana setiap instance error merapsulasi kode status HTTP, kode error konstan, dan pesan aplikasi berbahasa Inggris (*English Application Message*).

### 4.1 Zero Hardcoding Constants (`packages/shared/src/constants/`)
Seluruh kode error, status HTTP, dan pesan dasar dideklarasikan secara terpusat:
```typescript
// packages/shared/src/constants/error-codes.ts
export const ERROR_CODES = {
  ROOM_NOT_FOUND: 'ERR_ROOM_NOT_FOUND',
  ROOM_FULL: 'ERR_ROOM_FULL',
  INVALID_ROOM_STATUS: 'ERR_INVALID_ROOM_STATUS',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

### 4.2 Kelas Dasar & Desentralisasi Error (`DomainError`)
```typescript
import { HTTP_STATUS, ERROR_CODES } from 'shared/constants';

export abstract class DomainError {
  abstract readonly statusCode: number;
  abstract readonly errorCode: string;
  abstract readonly message: string; // Wajib dalam Bahasa Inggris (English)

  /**
   * Desentralisasi format response HTTP.
   * Route handler tidak perlu memeriksa tipe error secara manual.
   */
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
```

### 4.3 Service Mengembalikan `ResultAsync<T, DomainError>`
```typescript
import { ResultAsync, ok, err } from 'neverthrow';
import { RoomNotFoundError, RoomFullError, DomainError } from './room.errors';
import { GAME_RULES } from 'shared/constants';

export class RoomService {
  static joinRoom(code: string, userId: string): ResultAsync<RoomState, DomainError> {
    const room = this.rooms.get(code);
    if (!room) {
      return err(new RoomNotFoundError(code));
    }
    if (room.players.length >= GAME_RULES.MAX_PLAYERS_PER_ROOM) {
      return err(new RoomFullError(GAME_RULES.MAX_PLAYERS_PER_ROOM));
    }
    room.players.push(userId);
    return ok(room);
  }
}
```

### 4.4 Eksekusi Desentralisasi di Route Handler Fastify
Handler Fastify tidak melakukan pengecekan `if (error.type === ...)` ataupun memuat *magic string*. Handler cukup mendeligasikan respons ke method `error.toResponse()` dan mengambil `error.statusCode`:
```typescript
const result = await RoomService.joinRoom(request.body.roomCode, request.body.userId);

if (result.isErr()) {
  const domainError = result.error;
  // Desentralisasi handling: objek error itu sendiri yang tahu status code & pesannya
  return reply
    .status(domainError.statusCode)
    .send(domainError.toResponse());
}

const roomState = result.value;
return reply.status(HTTP_STATUS.OK).send({ success: true, data: roomState });
```


---

## 5. Linter & Formatter (`Oxlint` / `Bun`)
Monorepo FighType menggunakan **Oxlint (`oxlint`)** sebagai tool linter resmi berbasis Rust yang berkecepatan tinggi (50-100x lebih cepat daripada ESLint konvensional), dipadukan dengan standar formatting yang terpusat:
- **Linter Resmi:** `oxlint` (`npx oxlint` / `bunx oxlint`) dijalankan pada setiap pre-commit hook dan CI build untuk mendeteksi *dead code*, *type safety violation*, dan *syntax issues* secara instan.
- **Indentasi:** 2 spasi (*2 spaces*), tanpa tab.
- **Semicolons:** Wajib di akhir setiap statement (`semicolons: true`).
- **Quotes:** Single quotes (`'string'`) untuk string TypeScript, Double quotes (`"string"`) untuk atribut JSX/React.
- **Trailing Comma:** `all` (selalu tambahkan koma pada elemen terakhir array/object multibarut).
