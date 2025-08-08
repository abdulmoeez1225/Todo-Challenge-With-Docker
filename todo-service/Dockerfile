# Use official Node.js LTS image
FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for Prisma)
RUN npm ci && npm rebuild

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Push database schema (with automatic yes response)
RUN echo "y" | npm run db:push || true

# Build the application
RUN npm run build

# Remove dev dependencies and build tools to reduce image size
RUN npm prune --production && apk del python3 make g++

EXPOSE 3002

# Use node directly instead of npm to avoid potential npm issues
CMD ["node", "dist/index.js"]
