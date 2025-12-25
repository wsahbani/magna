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

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Copy workspace packages
COPY packages ./packages
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application and generated Prisma Client from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules/@prisma ./apps/api/node_modules/@prisma

WORKDIR /app/apps/api

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]
