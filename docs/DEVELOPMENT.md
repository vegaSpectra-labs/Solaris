# Development Onboarding

This guide is intended to let a new contributor run the full FlowFi stack from a fresh clone.

## Prerequisites

Required:

1. Node.js 20.x and npm
1. Rust toolchain (rustup + cargo)
1. PostgreSQL 14+

Recommended:

1. Stellar CLI / Soroban CLI
1. Redis 7+ (optional for multi-instance SSE testing)
1. Docker + Docker Compose (easiest local infra)

## 1) Clone and Install

```bash
git clone https://github.com/LabsCrypt/flowfi.git
cd flowfi
```

Install root helpers (if any):

```bash
npm install
```

Install backend + frontend dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

## 2) Start Infrastructure

### Option A: Docker (recommended)

```bash
docker compose up -d postgres
```

If your compose file includes Redis and you want to test pub/sub SSE fanout:

```bash
docker compose up -d redis
```

### Option B: Local services

Run PostgreSQL locally and create/update your database for `DATABASE_URL`.
Run Redis locally only if needed.

## 3) Configure Environment

Create backend env file (example values):

```bash
cd backend
cp .env.example .env 2>/dev/null || true
```

Set at least:

1. `DATABASE_URL=postgresql://...`
1. `JWT_SECRET=...`
1. `STELLAR_NETWORK=testnet`
1. `MAX_SSE_CONNECTIONS=10000`

Optional Redis for multi-instance SSE:

1. `REDIS_URL=redis://localhost:6379`

Return to repo root after editing env.

## 4) Prepare Database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

Optional seed:

```bash
npm run prisma:seed
```

## 5) Build and Run Contracts (optional for UI/API iteration, required for full chain flow)

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

If deploying/testing contracts with CLI, ensure Stellar CLI is configured for testnet.

## 6) Run Backend

```bash
cd backend
npm run dev
```

Backend endpoints:

1. API base: `http://localhost:3001/v1`
1. Swagger UI: `http://localhost:3001/api-docs`
1. Health: `http://localhost:3001/health`

## 7) Run Frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Frontend app:

1. `http://localhost:3000`

## 8) Run Tests

Backend:

```bash
cd backend
npm test
```

Frontend lint:

```bash
cd frontend
npm run lint
```

## Common Issues

### Indexer not syncing

Symptoms:

1. Streams created on-chain do not appear in dashboard.

Checks:

1. Confirm backend worker/indexer is running.
1. Verify Stellar network config (`testnet` vs `mainnet`) matches your transactions.
1. Verify `IndexerState` row updates in DB.
1. Check backend logs for RPC/Horizon throttling or cursor errors.

### SSE drops or reconnect loops

Symptoms:

1. Live updates stop; browser reconnects repeatedly.

Checks:

1. Verify JWT is valid and unexpired.
1. Check `/v1/events/stats` for capacity limits.
1. Confirm per-IP limit not exceeded (6th SSE connection returns 429).
1. In multi-instance deployments, ensure Redis pub/sub connectivity on all instances.

### Auth errors (401/403)

Symptoms:

1. `Unauthorized` during subscribe or protected endpoint calls.

Checks:

1. Sign challenge using the same wallet/public key you verify.
1. Ensure backend `JWT_SECRET` is stable across restarts if testing long sessions.
1. Confirm `Authorization: Bearer <token>` header is present.

### Prisma or DB migration failures

Checks:

1. Ensure `DATABASE_URL` points to a reachable DB.
1. Reset local DB and rerun migrations if schema drift occurred.
1. Regenerate Prisma client after schema changes.

## Suggested Day-1 Workflow

1. Start Postgres (and optionally Redis).
1. Run backend migrations.
1. Start backend and open Swagger.
1. Start frontend and connect wallet.
1. Create a stream and verify updates via dashboard + SSE.
