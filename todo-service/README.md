# Todo Service

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   PORT=3002
   DATABASE_URL=postgresql://todo:password@todo-db:5432/todosdb
   JWT_SECRET=supersecretkey
   ```
3. Run migrations to create the todos table (see below).

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
- `POST /api/todos/` — Create todo (JWT required)
- `GET /api/todos/` — List todos (JWT required)
- `PUT /api/todos/:id` — Update todo (JWT required)
- `DELETE /api/todos/:id` — Delete todo (JWT required)

## Database Migration

Connect to the todo-db Postgres instance and run:
```sql
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  user_uuid UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_uuid) REFERENCES users(uuid)
);
```
