# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Copy workspace packages
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
WORKDIR /app/apps/api
RUN pnpm exec prisma generate

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install OpenSSL for Prisma (Alpine 3.18+ includes OpenSSL 3.0)
RUN apk add --no-cache openssl

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Copy workspace packages
COPY packages ./packages
COPY apps/api/package.json ./apps/api/

# Copy Prisma schema
COPY apps/api/prisma ./apps/api/prisma

# Install ALL dependencies (including devDependencies for Prisma CLI)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
WORKDIR /app/apps/api
RUN pnpm exec prisma generate

# Copy built application from builder
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/src/main.js"]
