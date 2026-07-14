# 15. Panduan Deployment & Operasional (Deployment Guide)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [04-tdd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/04-tdd.md), [05-adr.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/05-adr.md)  

---

## 1. Arsitektur Deployment Produksi
**FighType** dipersiapkan untuk dijalankan dalam kontainer **Docker** berkinerja tinggi. Aplikasi backend (`apps/server`) berjalan di atas runtime **Bun** (`oven/bun:1-alpine`), sementara aplikasi frontend (`apps/web`) dikompilasi menjadi aset statis dan disajikan melalui CDN atau reverse proxy (Nginx / Caddy) yang terhubung ke API dan WebSocket server.

---

## 2. Multi-Stage Dockerfile (`apps/server`)
Berikut adalah rancangan spesifikasi `Dockerfile` multi-stage untuk mengemas backend Fastify secara efisien:

```dockerfile
# Stage 1: Build & Prune Workspaces
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Salin konfigurasi monorepo root dan package files
COPY package.json bun.lockb tsconfig.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/game-engine/package.json packages/game-engine/
COPY apps/server/package.json apps/server/

# Install seluruh dependency monorepo
RUN bun install --frozen-lockfile

# Salin source code internal packages dan server
COPY packages/shared packages/shared
COPY packages/game-engine packages/game-engine
COPY apps/server apps/server

# Stage 2: Production Runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Salin node_modules dan source dari builder
COPY --from=builder /app ./

EXPOSE 3000

# Jalankan entrypoint server Bun
CMD ["bun", "run", "apps/server/src/index.ts"]
```

---

## 3. Matriks Konfigurasi Variabel Lingkungan (`Environment Variables`)
Seluruh variabel lingkungan divalidasi saat startup menggunakan **Zod Schema (`ADR-007`)** di `packages/shared/src/schemas/env-config.ts`. Jika variabel tidak sesuai, server menolak untuk start.

| Nama Variabel | Tipe / Contoh Nilai | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `development` / `production` | `development` | Mode eksekusi runtime server. |
| `PORT` | Integer (`3000`) | `3000` | Port HTTP REST API & WebSocket listener Fastify. |
| `HOST` | String (`0.0.0.0`) | `0.0.0.0` | Binding interface host server. |
| `DATABASE_URL`| Connection String (`postgres://user:pass@db:5432/fightype`) | *Required* | URL koneksi database PostgreSQL untuk Drizzle ORM. |
| `CORS_ORIGIN` | String (`https://fightype.com,http://localhost:5173`) | `*` | Daftar origin yang diizinkan untuk request HTTP/WS. |
| `LOG_LEVEL` | `fatal` / `error` / `warn` / `info` / `debug` | `info` | Tingkat detail logging Fastify (Pino logger). |

---

## 4. Persiapan Horizontal Scaling (Masa Depan)
Pada fase MVP awal, manajemen room (`RoomManager`) berjalan di dalam memori satu instance server Fastify yang mampu menangani ribuan pemain berkat efisiensi **Bun + Native WebSocket**.

Ketika lalu lintas pemain meningkat pesat di masa depan dan membutuhkan **Horizontal Pod Scaling (Kubernetes / Multi-server)**:
1. **Redis Pub/Sub Adapter:** Kita akan menghubungkan event broker `@fastify/websocket` dengan Redis Pub/Sub sehingga pesan `ROOM_STATE_TICK` dapat didistribusikan secara transparan melintasi banyak instance server.
2. **Sticky Sessions (Load Balancer):** Memastikan koneksi WebSocket untuk room yang sama diarahkan ke instance node yang sama selama sesi berlangsung untuk meminimalkan latensi antar-node.
