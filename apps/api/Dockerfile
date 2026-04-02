# Build stage
FROM dockerproxy.repos.tech.orange/andrewmackrodt/nodejs:20 AS builder

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Install pnpm
RUN npm install -g pnpm

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
FROM dockerproxy.repos.tech.orange/andrewmackrodt/nodejs:20 AS production

# Install OpenSSL for Prisma
# If Alpine-based:
RUN apk add --no-cache openssl
# If Debian/Ubuntu-based, replace the line above with:
# RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

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

# Start the application
CMD ["node", "dist/src/main.js"]