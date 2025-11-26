# Turborepo + Vite + React + NestJS + Prisma Monorepo - AI Coding Instructions

## Architecture Overview

This is a **Process Management System** built with **Turborepo monorepo** using pnpm workspaces with TypeScript throughout. The project follows clean architecture principles and implements a comprehensive business process management system following PYX4 methodology.

- **Apps**: 
  - `apps/web` - React + Vite frontend app (port 5173)
  - `apps/api` - NestJS backend API with Prisma ORM (port 3001)
- **Packages**: Shared libraries (`@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`)

## Key Development Patterns

### Workspace Dependencies
- Use `workspace:*` protocol for internal package references in package.json
- All packages are published as `@repo/*` scoped packages
- Components in `@repo/ui` use named exports with barrel exports pattern (`index.ts` re-exports)

### Clean Architecture Structure (API)
- **Modules**: Feature-based organization (`src/modules/process/`)
- **DTOs**: Data Transfer Objects with validation (`dto/`)
- **Entities**: Domain models and interfaces (`entities/`)
- **Repositories**: Data access layer with Prisma (`repositories/`)
- **Services**: Business logic implementation (`services/`)
- **Controllers**: API endpoints (`*.controller.ts`)
- **Common**: Shared utilities, exceptions, and base classes (`src/common/`)

### Database & Prisma Patterns
- **PostgreSQL**: Primary database with comprehensive schema
- **Schema-first**: Prisma schema defines the data model in `prisma/schema.prisma`
- **Migrations**: Version-controlled database changes with `prisma migrate`
- **Type Safety**: Generated Prisma client provides full TypeScript types
- **Seeding**: Comprehensive seed data in `prisma/seed.ts`

### Build & Development Workflow

#### Essential Commands
```bash
# Development (runs both frontend and API)
pnpm dev              # Runs all dev tasks in parallel
turbo run dev         # Alternative direct turbo command

# Building (respects dependency graph)
pnpm build            # Builds all packages with proper dependency order
turbo run build       # Dependencies build first due to "dependsOn": ["^build"]

# Database Operations
cd apps/api
npx prisma generate   # Generate Prisma client after schema changes
npx prisma migrate dev # Create and apply database migrations
npx prisma db seed    # Seed database with sample data
npx prisma studio     # Open visual database browser

# Testing
pnpm test             # Runs unit tests across all packages
pnpm test:e2e         # Runs end-to-end tests (API only)

# Linting
pnpm lint             # Runs ESLint on all packages
pnpm format           # Prettier formatting across all TypeScript/TSX/MD files
```

#### Development Servers
- **Frontend**: http://localhost:5173 (Vite dev server)
- **API**: http://localhost:3001 (NestJS with hot reload)
- **Database**: PostgreSQL (configure in `.env`)
- **CORS**: API configured to accept requests from frontend

### Process Management Domain

#### Core Entities
- **Process**: Hierarchical business processes (Level 1: Processus, Level 2: Procédures, Level 3: Instructions)
- **ProcessVersion**: Version control with draft/published states
- **User**: System users with role-based permissions
- **Role**: INTERNE/EXTERNE roles with unit assignments
- **Node/Edge**: Diagram modeling (PYX4 methodology)
- **Document/Mean**: Linked resources and tools

#### Business Rules
- Process hierarchy must respect level constraints (child level > parent level)
- Status transitions: DRAFT → REVIEW → APPROVED → PUBLISHED → ARCHIVED
- Versioning: Each process can have multiple versions with separate draft/published states
- Role-based access control with unit assignments

### API Development Patterns

#### Controllers
- RESTful endpoints with proper HTTP status codes
- DTO validation using class-validator decorators
- Consistent error handling with custom business exceptions
- Request/response transformation

#### Services
- Business logic implementation following single responsibility principle
- Comprehensive validation and error handling
- Logging for important operations
- Transaction management for complex operations

#### Repositories
- Data access abstraction layer
- Extends BaseRepository for common CRUD operations
- Complex queries with Prisma's type-safe query builder
- Pagination and filtering support

### TypeScript Configuration
- **Base config**: `packages/typescript-config/base.json` - shared strict configuration
- **Frontend**: Uses bundler module resolution for Vite
- **API**: Uses CommonJS modules for Node.js compatibility with decorators enabled
- **Library-specific**: UI package uses ESNext modules with declaration output

### ESLint Configuration
- **Root config**: Extends shared `@repo/eslint-config`
- **Workspace ESLint**: Configured for auto-discovery in VS Code settings
- **Custom rules**: `@typescript-eslint/no-non-null-assertion` disabled project-wide

## Critical File Locations
- **Monorepo config**: `pnpm-workspace.yaml`, `turbo.json`
- **Shared configs**: `packages/eslint-config/`, `packages/typescript-config/`
- **Frontend**: `apps/web/src/main.tsx` (entry point)
- **API**: `apps/api/src/main.ts` (server entry), `apps/api/src/app.module.ts` (root module)
- **Database**: `apps/api/prisma/schema.prisma` (data model), `apps/api/src/database/prisma.service.ts`
- **Process Module**: `apps/api/src/modules/process/` (complete process management)
- **Component library**: `packages/ui/components/` and `packages/ui/index.ts`
- **Documentation**: `docs/` (architecture, development guide, API docs)

## Development Environment
- **Package manager**: pnpm (locked to 8.15.6)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: class-validator for DTO validation
- **VS Code**: ESLint auto-discovery configured for workspace mode
- **Build tools**: Vite for frontend, NestJS CLI for API
- **Testing**: Jest for both frontend and API testing

## SOLID Principles Implementation
- **Single Responsibility**: Each service, repository, and controller has a single purpose
- **Open/Closed**: Extensible through dependency injection and interfaces
- **Liskov Substitution**: BaseRepository can be substituted with any specific repository
- **Interface Segregation**: Separate interfaces for different concerns
- **Dependency Inversion**: Services depend on repository abstractions, not concrete implementations