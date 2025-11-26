# Development Guide

## Prerequisites

- Node.js 18+
- pnpm 8.15.6+
- PostgreSQL 14+
- Git

## Environment Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd process-manager-orange
pnpm install
```

### 2. Database Setup

```bash
# Start PostgreSQL (example with Docker)
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=process_manager -p 5432:5432 -d postgres:14

# Set up environment
cp apps/api/.env.example apps/api/.env
# Edit DATABASE_URL in .env file
```

### 3. Database Migration

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

### 4. Start Development Servers

```bash
# From root directory
pnpm dev

# This starts:
# - Frontend: http://localhost:5173
# - API: http://localhost:3001
# - Prisma Studio: npx prisma studio (optional)
```

## Project Structure

```
process-manager-orange/
├── apps/
│   ├── web/                 # React frontend
│   └── api/                 # NestJS backend
│       ├── prisma/          # Database schema & migrations
│       └── src/
│           ├── modules/     # Feature modules
│           │   └── process/ # Process management module
│           ├── common/      # Shared utilities
│           └── database/    # Database service
├── packages/               # Shared packages
│   ├── ui/                # UI components
│   ├── eslint-config/     # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
└── docs/                  # Documentation
```

## Development Commands

### Monorepo Commands
```bash
pnpm dev              # Start all development servers
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm test             # Run all tests
pnpm format           # Format code with Prettier
```

### API-specific Commands
```bash
cd apps/api

# Database
npx prisma studio           # Open database GUI
npx prisma migrate dev      # Create and apply migrations
npx prisma generate         # Generate Prisma client
npx prisma db seed          # Seed database
npx prisma db push          # Push schema without migration

# Development
pnpm dev                    # Start with hot reload
pnpm test                   # Run unit tests
pnpm test:e2e              # Run e2e tests
pnpm test:cov              # Run tests with coverage
```

## Code Organization

### Clean Architecture Principles

1. **Modules**: Each feature is a self-contained module
2. **DTOs**: Data Transfer Objects for API contracts
3. **Entities**: Domain models and interfaces
4. **Repositories**: Data access layer abstraction
5. **Services**: Business logic implementation
6. **Controllers**: API endpoints and request handling

### Example Module Structure
```
modules/process/
├── dto/                    # Data Transfer Objects
│   ├── create-process.dto.ts
│   ├── update-process.dto.ts
│   └── process-query.dto.ts
├── entities/               # Domain entities
│   └── process.entity.ts
├── repositories/           # Data access
│   └── process.repository.ts
├── services/              # Business logic
│   └── process.service.ts
├── process.controller.ts  # API endpoints
└── process.module.ts      # Module definition
```

## Development Guidelines

### SOLID Principles

1. **Single Responsibility**: Each class has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes must be substitutable for base types
4. **Interface Segregation**: Clients shouldn't depend on unused interfaces
5. **Dependency Inversion**: Depend on abstractions, not concretions

### Code Quality

- **TypeScript**: Use strict type checking
- **Validation**: Validate all inputs with class-validator
- **Error Handling**: Use custom business exceptions
- **Logging**: Log important operations and errors
- **Testing**: Write unit tests for services and repositories
- **Documentation**: Document complex business logic

### Database Best Practices

- **Migrations**: Always use migrations for schema changes
- **Indexing**: Add indexes for frequently queried fields
- **Relationships**: Use proper foreign key constraints
- **Soft Deletes**: Consider soft deletes for important data
- **Transactions**: Use transactions for multi-step operations

## Debugging

### Common Issues

1. **Prisma Client Issues**: Run `npx prisma generate` after schema changes
2. **Port Conflicts**: Check if ports 3001 (API) or 5173 (frontend) are in use
3. **Database Connection**: Verify PostgreSQL is running and DATABASE_URL is correct
4. **Type Errors**: Ensure all dependencies are installed with `pnpm install`

### Useful Tools

- **Prisma Studio**: Visual database browser
- **VS Code Extensions**: Prisma, ESLint, Prettier
- **PostgreSQL GUI**: pgAdmin, TablePlus, or DBeaver
- **API Testing**: Thunder Client, Postman, or REST Client

## Contributing

1. Create feature branch from `main`
2. Follow existing code patterns
3. Write tests for new functionality
4. Update documentation as needed
5. Ensure all linting and tests pass
6. Create pull request with clear description