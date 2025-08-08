# User Service

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@user-db:5432/usersdb
   JWT_SECRET=supersecretkey
   ```
3. Run migrations to create the users table (see below).

## Development

- Start in dev mode:
  ```bash
  npm run dev
  ```
- Build and start:
  ```bash
  npm run build && npm start
  ```

## Endpoints
- `POST /api/users/register` — Register new user
- `POST /api/users/login` — Login and receive JWT

## Database Migration

Connect to the user-db Postgres instance and run:
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS users (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```
