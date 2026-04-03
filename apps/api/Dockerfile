# Build stage
FROM dockerproxy.repos.tech.orange/andrewmackrodt/nodejs:20 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

RUN npm install -g pnpm

COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api
RUN pnpm exec prisma generate

RUN pnpm run build

#Production stage
FROM dockerproxy.repos.tech.orange/andrewmackrodt/nodejs:20e AS production

# ✅ Fix: switch to root for system-level package installation
USER root
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

COPY packages ./packages
COPY apps/api/package.json ./apps/api/

COPY apps/api/prisma ./apps/api/prisma

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api
RUN pnpm exec prisma generate

WORKDIR /app
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/src/main.js"]