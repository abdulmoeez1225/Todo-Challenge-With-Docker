# TodoMaster

A full-stack todo application with microservices architecture. Built with Node.js, React, and PostgreSQL.

## Architecture

- **User Service** (Port 3001): User registration, login, and JWT authentication
- **Todo Service** (Port 3002): Todo CRUD operations with JWT validation
- **Frontend** (Port 3000): React UI with two-column layout
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest test suites for both services
- **Docker**: Containerized deployment

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Running with Docker

1. Clone and start:
   ```bash
   git clone <repository-url>
   cd AICI_Challenge
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - User Service API: http://localhost:3001
   - Todo Service API: http://localhost:3002

### Features
- Two-column UI layout
- Dark/light mode toggle
- User authentication with JWT
- Real-time todo management
- Responsive design
- Status filtering and search
## Frontend

- Two-column layout (add/manage todos)
- User authentication (login/register)
- CRUD operations with inline editing
- Dark/light mode toggle
- Search and status filtering
- Responsive design
- JWT token management
- Form validation and notifications

## API Documentation

### User Service Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "uuid": 1,
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Todo Service Endpoints

All todo endpoints require a valid JWT token in the Authorization header:
```http
Authorization: Bearer <jwt_token>
```

#### Create Todo
```http
POST /api/todos/
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the AICI challenge",
  "status": "pending"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "userUuid": 1,
  "title": "Complete project",
  "description": "Finish the todo challenge",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get All Todos
```http
GET /api/todos/
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_uuid": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete project",
    "description": "Finish the AICI challenge",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Update Todo
```http
PUT /api/todos/1
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the AICI challenge",
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_uuid": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project",
  "description": "Finish the AICI challenge",
  "status": "completed",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T01:00:00.000Z"
}
```

#### Delete Todo
```http
DELETE /api/todos/1
```

**Response (204 No Content)**

## Development

### Local Development

1. Install dependencies for each service:
   ```bash
   cd user-service && npm install
   cd ../todo-service && npm install
   cd ../frontend && npm install
   ```

2. Set up environment variables:
   ```bash
   # user-service/.env
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5433/usersdb
   JWT_SECRET=supersecretkey

   # todo-service/.env
   PORT=3002
   DATABASE_URL=postgresql://todo:password@localhost:5434/todosdb
   JWT_SECRET=supersecretkey
   ```

3. Start services in development mode:
   ```bash
   # Terminal 1
   cd user-service && npm run dev

   # Terminal 2
   cd todo-service && npm run dev

   # Terminal 3
   cd frontend && npm run dev
   ```

### 🧪 Testing

Run comprehensive test suites for each service:
```bash
# User Service Tests (6 tests)
cd user-service && npm test

# Todo Service Tests (7 tests)
cd ../todo-service && npm test
```

**Test Coverage:**
- **User Service**: Registration, login, validation, duplicate email handling
- **Todo Service**: CRUD operations, JWT authentication, status validation
- **Automated**: All tests use proper JWT tokens and unique test data
- **CI Ready**: Tests are designed for continuous integration

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Resource deleted successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: User not authorized to access resource
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (e.g., email already registered)
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Additional error details (in development)"
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- User ownership validation for todos
- CORS enabled for cross-origin requests
- Environment variable configuration

## 🗄️ Database Schema (Prisma)

### User Model
```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  todos        Todo[]

  @@map("users")
}
```

### Todo Model
```prisma
model Todo {
  id          Int      @id @default(autoincrement())
  userUuid    Int
  title       String
  description String   @default("")
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userUuid], references: [id])

  @@map("todos")
}
```

**Valid Status Values**: `pending`, `in-progress`, `completed`

**Database Features:**
- **Type Safety**: Prisma provides full TypeScript type safety
- **Auto-generated Client**: Database client is automatically generated
- **Migration Support**: Schema changes are tracked and versioned
- **Relation Management**: Automatic foreign key handling

## Implementation

### User Service
- User registration and login
- JWT authentication
- Password hashing with bcrypt
- Email validation
- Prisma ORM integration
- Test coverage

### Todo Service
- CRUD operations for todos
- JWT validation
- User-specific data access
- Status validation
- Prisma ORM integration
- Test coverage

### Frontend
- Two-column layout
- Authentication forms
- Todo management interface
- Dark/light mode
- Search and filtering
- Responsive design
- Form validation

### Infrastructure
- Docker containerization
- Database migrations
- Health monitoring
- Environment configuration

## Development

```bash
git clone <repo>
cd AICI_Challenge
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- User API: http://localhost:3001
- Todo API: http://localhost:3002

Testing:
```bash
cd user-service && npm test
cd ../todo-service && npm test
```

## Tech Stack

- Node.js, Express, TypeScript
- PostgreSQL, Prisma ORM
- React, Vite
- JWT authentication
- Jest testing
- Docker

## License

ISC
