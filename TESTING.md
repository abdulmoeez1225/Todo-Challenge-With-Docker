# Testing Guide - AICI Challenge

This guide covers all testing aspects of the AICI Challenge Todo System.

## Table of Contents
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [API Testing](#api-testing)
- [Frontend Testing](#frontend-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)

## Unit Tests

### Running Unit Tests

```bash
# Test User Service
cd user-service
npm test

# Test Todo Service
cd ../todo-service
npm test

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The unit tests cover:
- **User Service**:
  - User registration validation
  - User login validation
  - Password hashing
  - JWT token generation
  - Error handling

- **Todo Service**:
  - JWT authentication middleware
  - CRUD operations validation
  - User ownership validation
  - Error handling

## Integration Tests

### Database Integration Tests

```bash
# Start the services with test databases
docker-compose -f docker-compose.test.yml up --build

# Run integration tests
npm run test:integration
```

### API Integration Tests

Test the complete API flow:

1. **Register a new user**
2. **Login and get JWT token**
3. **Create a todo**
4. **Read todos**
5. **Update a todo**
6. **Delete a todo**

## API Testing

### Using Postman Collection

1. Import the `AICI_Challenge_API.postman_collection.json` file
2. Set up environment variables:
   - `base_url`: http://localhost:3001
   - `todo_base_url`: http://localhost:3002
   - `jwt_token`: (will be set automatically after login)

3. Run the collection in order:
   - Health Check (User Service)
   - Register User
   - Login User (automatically sets JWT token)
   - Health Check (Todo Service)
   - Create Todo
   - Get All Todos
   - Update Todo
   - Delete Todo

### Using curl Commands

```bash
# Health checks
curl http://localhost:3001/health
curl http://localhost:3002/health

# Register user
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create todo (replace TOKEN with actual JWT token)
curl -X POST http://localhost:3002/api/todos/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Todo","description":"Test Description","status":"pending"}'

# Get todos
curl -X GET http://localhost:3002/api/todos/ \
  -H "Authorization: Bearer TOKEN"

# Update todo
curl -X PUT http://localhost:3002/api/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Updated Todo","description":"Updated Description","status":"completed"}'

# Delete todo
curl -X DELETE http://localhost:3002/api/todos/1 \
  -H "Authorization: Bearer TOKEN"
```

## Frontend Testing

### Manual Testing

1. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test User Registration**:
   - Navigate to http://localhost:3000
   - Fill in registration form with valid email and password (min 6 chars)
   - Submit and verify success message

3. **Test User Login**:
   - Use the same credentials to login
   - Verify JWT token is stored in localStorage
   - Verify redirect to todo management interface

4. **Test Todo Management**:
   - Create a new todo with title, description, and status
   - Verify todo appears in the list
   - Edit the todo and verify changes are saved
   - Delete the todo and verify it's removed from the list

5. **Test Error Handling**:
   - Try to register with existing email (should show error)
   - Try to login with wrong password (should show error)
   - Try to access todos without authentication (should redirect to login)

### Automated Frontend Tests

```bash
# Install testing dependencies
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run frontend tests
npm test
```

## End-to-End Testing

### Complete User Flow Test

1. **Start all services**:
   ```bash
   docker-compose up --build
   ```

2. **Run database migrations** (as described in README)

3. **Test complete user journey**:
   - Open browser to http://localhost:3000
   - Register a new user account
   - Login with the account
   - Create multiple todos with different statuses
   - Edit todos and verify changes persist
   - Delete todos and verify removal
   - Logout and verify session is cleared
   - Login again and verify todos are still there

### Cross-Browser Testing

Test the application in:
- Chrome
- Firefox
- Safari
- Edge

## Performance Testing

### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run load-test.yml
```

### Load Test Configuration

Create `load-test.yml`:

```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: "User Registration and Login"
    flow:
      - post:
          url: "/api/users/register"
          json:
            email: "{{ $randomEmail() }}"
            password: "password123"
      - post:
          url: "/api/users/login"
          json:
            email: "{{ $randomEmail() }}"
            password: "password123"
```

## Security Testing

### JWT Token Testing

1. **Test invalid tokens**:
   ```bash
   curl -X GET http://localhost:3002/api/todos/ \
     -H "Authorization: Bearer invalid_token"
   ```

2. **Test expired tokens**:
   - Create a token with short expiration
   - Wait for expiration
   - Try to use the token

3. **Test missing tokens**:
   ```bash
   curl -X GET http://localhost:3002/api/todos/
   ```

### Input Validation Testing

1. **Test SQL injection attempts**:
   ```bash
   curl -X POST http://localhost:3001/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com; DROP TABLE users;","password":"password123"}'
   ```

2. **Test XSS attempts**:
   ```bash
   curl -X POST http://localhost:3002/api/todos/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN" \
     -d '{"title":"<script>alert(\"xss\")</script>","description":"Test","status":"pending"}'
   ```

## Database Testing

### Connection Testing

```bash
# Test user database connection
docker exec -it aici_challenge-user-db-1 psql -U user -d usersdb -c "SELECT version();"

# Test todo database connection
docker exec -it aici_challenge-todo-db-1 psql -U todo -d todosdb -c "SELECT version();"
```

### Data Integrity Testing

```bash
# Verify foreign key constraints
docker exec -it aici_challenge-todo-db-1 psql -U todo -d todosdb -c "
INSERT INTO todos (user_uuid, title, description, status) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Test', 'Test', 'pending');"
```

## Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: |
        cd user-service && npm install
        cd ../todo-service && npm install
        cd ../frontend && npm install
        
    - name: Run tests
      run: |
        cd user-service && npm test
        cd ../todo-service && npm test
```

## Test Data

### Sample Test Users

```json
[
  {
    "email": "test1@example.com",
    "password": "password123"
  },
  {
    "email": "test2@example.com", 
    "password": "password456"
  }
]
```

### Sample Test Todos

```json
[
  {
    "title": "Complete AICI Challenge",
    "description": "Finish implementing all user stories",
    "status": "pending"
  },
  {
    "title": "Write Documentation",
    "description": "Create comprehensive README and API docs",
    "status": "in-progress"
  },
  {
    "title": "Deploy Application",
    "description": "Deploy to production environment",
    "status": "completed"
  }
]
```

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Verify PostgreSQL containers are running
   - Check environment variables
   - Ensure migrations have been run

2. **JWT token issues**:
   - Verify JWT_SECRET is set correctly
   - Check token expiration
   - Ensure Authorization header format

3. **CORS errors**:
   - Verify CORS configuration in both services
   - Check frontend proxy configuration

4. **Port conflicts**:
   - Ensure ports 3000, 3001, 3002, 5433, 5434 are available
   - Stop any conflicting services

### Debug Mode

Enable debug logging:

```bash
# User Service
DEBUG=* npm run dev

# Todo Service  
DEBUG=* npm run dev

# Frontend
npm run dev -- --debug
```
