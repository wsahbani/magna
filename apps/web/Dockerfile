# Build stage
FROM node:20-alpine AS builder

# Accept build arguments
ARG VITE_API_URL=http://localhost:3001
ARG VITE_APP_NAME=MAGNA
ARG VITE_APP_VERSION=1.0.0

# Set as environment variables for Vite build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Copy workspace packages
COPY packages ./packages
COPY apps/web ./apps/web


# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the web application
WORKDIR /app/apps/web
RUN pnpm run build

# Production stage with nginx
FROM nginx:1.25-alpine AS production

# Copy custom nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4200/ || exit 1

# Expose port 4200
EXPOSE 4200

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
