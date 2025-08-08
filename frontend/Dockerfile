# Build stage
FROM node:20-alpine as build

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Install dependencies with clean install for reproducible builds
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Install all dependencies for build/lint/test
RUN npm ci --no-audit --no-fund

# Run linting and type checking
RUN npm run lint && npm run format:check

# Build the application
RUN npm run build

# Remove dev dependencies for final image
RUN npm prune --production

# Production stage
FROM nginx:1.25-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Use the built-in nginx user/group (already non-root)
USER root

# Copy built application
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html \
    /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Switch to non-root
USER nginx

EXPOSE 80
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]

