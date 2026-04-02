# Multi-stage build for Vite Web app
FROM dockerproxy.repos.tech.orange/andrewmackrodt/nodejs:20 AS base
#node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.6 && \
  npm cache clean --force

WORKDIR /app

# ============================================
# Dependencies stage
# ============================================
FROM base AS deps

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all packages' package.json files (needed for workspace resolution)
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Copy all apps' package.json files (needed for workspace resolution)
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/

# Copy .npmrc if exists
COPY .npmrc* ./

# Install ALL dependencies (including web and its workspace deps)
RUN pnpm install --frozen-lockfile && \
  pnpm store prune

# ============================================
# Builder stage
# ============================================
FROM base AS builder

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy ALL installed dependencies with workspace structure
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps ./apps

# Now copy source code on top (this preserves node_modules but adds source)
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Build arguments
ARG VITE_API_URL
ARG VITE_APP_NAME=MAGNA
ARG VITE_APP_VERSION=1.0.0

ENV NODE_ENV=production
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Build workspace dependencies then the app
RUN pnpm -r --filter="@repo/ui..." build && \
  cd apps/web && \
  pnpm build

# Verify build succeeded
RUN test -d /app/apps/web/dist || \
  (echo "Build failed: dist output not found" && exit 1)

# ============================================
# Production stage - Nginx
# ============================================
FROM nginx:1.25-alpine AS production

# Install wget for health checks
RUN apk add --no-cache wget

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files to nginx html directory
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Create nginx cache directory
RUN mkdir -p /var/cache/nginx/client_temp && \
  mkdir -p /var/cache/nginx/proxy_temp && \
  mkdir -p /var/cache/nginx/fastcgi_temp && \
  mkdir -p /var/cache/nginx/uwsgi_temp && \
  mkdir -p /var/cache/nginx/scgi_temp && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /usr/share/nginx/html && \
  chown -R nginx:nginx /var/log/nginx

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 4200
EXPOSE 4200

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
