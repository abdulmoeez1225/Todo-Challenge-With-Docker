#!/bin/bash

# Development setup script for Todo Challenge

set -e

echo "Setting up development environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${YELLOW}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

print_info "Creating environment files..."

# Create user-service .env file
if [ ! -f "user-service/.env" ]; then
    print_info "Creating user-service/.env..."
    cat > user-service/.env << 'EOF'
# Database connection string
DATABASE_URL="postgresql://postgres:password@postgres:5432/todo_db?schema=public"

# Server port
PORT=3001

# JWT secret key (change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
EOF
    print_success "Created user-service/.env"
else
    print_success "user-service/.env already exists"
fi

# Create todo-service .env file
if [ ! -f "todo-service/.env" ]; then
    print_info "Creating todo-service/.env..."
    cat > todo-service/.env << 'EOF'
# Database connection string
DATABASE_URL="postgresql://postgres:password@postgres:5432/todo_db?schema=public"

# Server port
PORT=3002

# JWT secret key (must match user-service!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
EOF
    print_success "Created todo-service/.env"
else
    print_success "todo-service/.env already exists"
fi

print_info "Installing dependencies..."

# Install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    print_info "Installing frontend dependencies..."
    cd frontend && npm ci && cd ..
    print_success "Frontend dependencies installed"
fi

# Install user-service dependencies
if [ ! -d "user-service/node_modules" ]; then
    print_info "Installing user-service dependencies..."
    cd user-service && npm ci && cd ..
    print_success "User service dependencies installed"
fi

# Install todo-service dependencies
if [ ! -d "todo-service/node_modules" ]; then
    print_info "Installing todo-service dependencies..."
    cd todo-service && npm ci && cd ..
    print_success "Todo service dependencies installed"
fi

print_info "Fixing code formatting..."

# Fix frontend formatting
cd frontend
npm run lint:fix 2>/dev/null || true
npm run format 2>/dev/null || true
cd ..

# Fix user-service formatting
cd user-service
npm run lint:fix 2>/dev/null || true
npm run format 2>/dev/null || true
cd ..

# Fix todo-service formatting
cd todo-service
npm run lint:fix 2>/dev/null || true
npm run format 2>/dev/null || true
cd ..

print_success "Code formatting fixed"

echo ""
echo -e "${GREEN}🎉 Development environment setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Start the application: docker-compose up --build"
echo "  2. Or run individual services:"
echo "     - Frontend: cd frontend && npm run dev"
echo "     - User Service: cd user-service && npm run dev"
echo "     - Todo Service: cd todo-service && npm run dev"
echo ""
echo "🔍 Run quality checks: ./quality-check.sh"
echo ""
echo "🌐 Access points:"
echo "  - Frontend: http://localhost:3000"
echo "  - User Service: http://localhost:3001"
echo "  - Todo Service: http://localhost:3002"
