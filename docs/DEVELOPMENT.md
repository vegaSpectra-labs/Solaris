# FlowFi Development Guide

This guide explains how to set up the FlowFi project locally for development.

## Prerequisites

Ensure you have the following installed before starting:
- **Rust** (for compiling Soroban smart contracts)
- **Node.js 20+** (for frontend and backend)
- **Stellar CLI** (for deploying contracts and managing identities)
- **PostgreSQL** (can be run via Docker Compose)

## Step-by-Step Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd flowfi
   ```

2. **Start the database:**
   We recommend using the provided `docker-compose.yml` to run the Postgres database locally.
   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies:**
   Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

   Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables:**
   - In `backend`, copy `.env.example` to `.env` and set `DATABASE_URL` (defaults to the docker-compose setup).
   - In `frontend`, copy `.env.example` to `.env.local`.

5. **Initialize the Database:**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

6. **Start the Services:**
   - Run the backend API & Indexer:
     ```bash
     cd backend
     npm run dev
     ```
   - Run the frontend:
     ```bash
     cd frontend
     npm run dev
     ```

## Running against Testnet vs Local Sandbox

**Testnet:**
By default, you can configure your backend `.env` and frontend to point to the Stellar Testnet. When deploying the smart contracts, use `--network testnet` (via our `deploy.sh` script) and update your frontend's `NEXT_PUBLIC_CONTRACT_ID`.

**Local Sandbox:**
The backend supports a sandbox mode for risk-free testing without polluting production or testnet metrics. Enable it by setting `SANDBOX_MODE_ENABLED=true` in your backend `.env` and appending `?sandbox=true` to your requests. See `backend/docs/SANDBOX_MODE.md` for more details.

## Common Troubleshooting

- **Indexer Not Syncing:** Check if your `DATABASE_URL` is correct and Postgres is running. Also check the `indexer_state` table in the DB to see if the last processed ledger is stuck. Look at the backend console for Stellar Horizon connection errors.
- **SSE Not Connecting:** If the frontend is not receiving real-time updates, check the Network tab in your browser's DevTools. The SSE connection to `/v1/events/subscribe` should remain open (status 200). Ensure CORS settings in the backend allow the frontend origin.

