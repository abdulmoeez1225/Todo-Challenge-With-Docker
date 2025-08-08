#!/bin/bash

# Run quality checks for the Todo Challenge project

set -e

echo "Running code quality checks..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}📋 $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

print_info "Checking Frontend Code Quality..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm ci
fi

# Run frontend quality checks
npm run lint
print_status $? "Frontend linting"

npm run format:check
print_status $? "Frontend formatting"

npm run build
print_status $? "Frontend build"

cd ..

print_info "Checking User Service Code Quality..."
cd user-service

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing user-service dependencies..."
    npm ci
fi

# Run user service quality checks
npm run lint
print_status $? "User service linting"

npm run format:check
print_status $? "User service formatting"

npm run type-check
print_status $? "User service type checking"

npm run build
print_status $? "User service build"

cd ..

print_info "Checking Todo Service Code Quality..."
cd todo-service

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing todo-service dependencies..."
    npm ci
fi

# Run todo service quality checks
npm run lint
print_status $? "Todo service linting"

npm run format:check
print_status $? "Todo service formatting"

npm run type-check
print_status $? "Todo service type checking"

npm run build
print_status $? "Todo service build"

cd ..

print_info "Running Tests..."

# Run user service tests
cd user-service
npm test
print_status $? "User service tests"
cd ..

# Run todo service tests
cd todo-service
npm test
print_status $? "Todo service tests"
cd ..

print_info "Checking Docker Configuration..."

# Validate docker-compose file
docker-compose config > /dev/null
print_status $? "Docker Compose configuration"

echo ""
echo -e "${GREEN}🎉 All quality checks passed!${NC}"
echo -e "${GREEN}✨ Your Todo Challenge project is ready for evaluation!${NC}"
echo ""
echo "📊 Quality Report:"
echo "  ✅ Frontend: Linting, formatting, and build successful"
echo "  ✅ User Service: Linting, formatting, type checking, and build successful"
echo "  ✅ Todo Service: Linting, formatting, type checking, and build successful"
echo "  ✅ Tests: All test suites passing"
echo "  ✅ Docker: Configuration validated"
echo ""
echo "🚀 To start the application:"
echo "   docker-compose up --build"
