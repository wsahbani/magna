# SIPOC Module - Implementation Documentation

## Overview

This module provides a complete **SIPOC (Supplier, Input, Process, Output, Customer)** diagram management system to replace Excel-based workflows with a dynamic, web-based solution. Built following **SOLID principles** and **KISS (Keep It Simple, Stupid)** philosophy.

## Architecture

### Backend (NestJS + Prisma)

#### Clean Architecture Structure

```
apps/api/src/modules/sipoc/
├── dto/                          # Data Transfer Objects with validation
│   ├── create-sipoc.dto.ts
│   ├── update-sipoc.dto.ts
│   ├── create-element.dto.ts
│   ├── update-element.dto.ts
│   ├── reorder-elements.dto.ts
│   └── create-connection.dto.ts
├── entities/                     # Domain models & interfaces
│   └── sipoc.entity.ts
├── repositories/                 # Data access layer (Prisma)
│   ├── sipoc-diagram.repository.ts
│   ├── sipoc-element.repository.ts
│   └── sipoc-connection.repository.ts
├── services/                     # Business logic
│   └── sipoc.service.ts
├── controllers/                  # REST API endpoints
│   ├── sipoc.controller.ts
│   ├── sipoc-elements.controller.ts
│   └── sipoc-connections.controller.ts
└── sipoc.module.ts              # Module configuration
```

#### SOLID Principles Applied

1. **Single Responsibility Principle (SRP)**
   - Each repository handles one entity's data access
   - Each controller manages one resource type
   - Service orchestrates business logic without coupling to data layer

2. **Open/Closed Principle (OCP)**
   - Repositories can be extended without modifying existing code
   - DTOs use class-validator decorators for extensible validation

3. **Liskov Substitution Principle (LSP)**
   - Repositories use PrismaService abstraction
   - All repositories follow consistent interface patterns

4. **Interface Segregation Principle (ISP)**
   - Separate DTOs for create/update operations
   - Focused controller endpoints (diagrams, elements, connections)

5. **Dependency Inversion Principle (DIP)**
   - Services depend on repository abstractions
   - Controllers depend on service abstraction
   - Injection through NestJS dependency injection

### Frontend (React + Zustand)

```
apps/web/src/features/sipoc/
├── components/                   # React components
│   ├── SipocEditor.tsx          # Main editor container
│   ├── SipocBoard.tsx           # 5-column SIPOC board
│   ├── SipocElementCard.tsx     # Editable element card
│   └── SipocListPage.tsx        # Diagram list view
├── store/                        # State management
│   └── sipocStore.ts            # Zustand store (normalized)
├── types/                        # TypeScript definitions
│   └── sipoc.types.ts
└── index.ts                      # Public exports
```

## Database Schema

### Models

- **SipocDiagram**: Main diagram entity
- **SipocElement**: Elements (supplier, input, process, output, customer)
- **SipocConnection**: Links between elements across diagrams
- **SipocTag**: Tag relationships
- **SipocHistory**: Version history tracking
- **SipocPermission**: User access control
- **SipocComment**: Threaded comments

### Key Features

- UUID primary keys for distributed systems
- Cascading deletes for referential integrity
- Indexed foreign keys for performance
- Enum types for element classification

## API Endpoints

### SIPOC Diagrams

```
GET    /sipoc?userId=xxx&status=draft&processId=yyy
GET    /sipoc/:id
POST   /sipoc?userId=xxx
PUT    /sipoc/:id
DELETE /sipoc/:id
```

### Elements

```
GET    /sipoc/:sipocId/elements
POST   /sipoc/:sipocId/elements
PUT    /sipoc/:sipocId/elements/:elementId
PUT    /sipoc/:sipocId/elements/reorder
DELETE /sipoc/:sipocId/elements/:elementId
```

### Connections

```
GET    /sipoc/:sipocId/connections
POST   /sipoc/:sipocId/connections
DELETE /sipoc/:sipocId/connections/:connectionId
```

## Frontend State Management

### Zustand Store Pattern

- **Normalized state**: Diagrams, elements, and connections stored by ID
- **Optimistic updates**: Immediate UI feedback
- **Error handling**: Global error state with recovery
- **Selective re-renders**: Only affected components update

### Key Actions

```typescript
// Diagrams
fetchDiagrams(userId, filters)
createDiagram(data, userId)
updateDiagram(sipocId, data)
deleteDiagram(sipocId)

// Elements
createElement(data)
updateElement(sipocId, elementId, data)
deleteElement(sipocId, elementId)
reorderElements(sipocId, elements)

// Connections
createConnection(data)
deleteConnection(sipocId, connectionId)
```

## Running the Application

### Prerequisites

1. **Database**: PostgreSQL running on `localhost:5432`
2. **Node.js**: v18+ with pnpm
3. **Environment**: `.env` file in `apps/api/`

### Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
cd apps/api
npx prisma generate

# Run migration (ensure database is running)
npx prisma migrate dev --name add_sipoc_module

# Seed database (optional)
npx prisma db seed
```

### Development

```bash
# From project root
pnpm dev

# API: http://localhost:3001
# Frontend: http://localhost:5173
```

### Access SIPOC Module

- **List view**: http://localhost:5173/sipoc
- **Editor**: http://localhost:5173/sipoc/:id

## Usage Guide

### Creating a SIPOC Diagram

1. Navigate to `/sipoc`
2. Click "New SIPOC"
3. Enter title and description
4. Click "Create"

### Editing Elements

1. Open a diagram
2. Click "+" in any column (Suppliers, Inputs, Process, Outputs, Customers)
3. Edit inline by clicking the pencil icon
4. Delete with trash icon
5. Reorder by drag (future enhancement)

### Element Types

- **Supplier**: External providers (supports `contactInfo`)
- **Input**: Resources/materials required
- **Process**: Core activities (supports `duration`, `responsibleRole`)
- **Output**: Results/deliverables (supports `qualityCriteria`)
- **Customer**: Recipients/consumers (supports `contactInfo`)

### Connections

Connect elements across diagrams to model complex flows (API ready, UI coming soon).

## Testing

### API Testing

```bash
cd apps/api
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests
```

### Manual Testing with cURL

```bash
# Create diagram
curl -X POST http://localhost:3001/sipoc?userId=user123 \
  -H "Content-Type: application/json" \
  -d '{"title":"Order Fulfillment","description":"E-commerce order process"}'

# Get diagrams
curl http://localhost:3001/sipoc?userId=user123

# Create element
curl -X POST http://localhost:3001/sipoc/{sipocId}/elements \
  -H "Content-Type: application/json" \
  -d '{
    "sipoc_id":"{sipocId}",
    "type":"supplier",
    "title":"Warehouse",
    "description":"Main distribution center",
    "position":0,
    "contactInfo":"warehouse@example.com"
  }'
```

## Future Enhancements

### Planned Features

1. **Drag & Drop Reordering**: Visual element repositioning
2. **Connection UI**: Interactive connection drawing
3. **Export**: PDF/PNG generation
4. **Templates**: Pre-built SIPOC templates
5. **Collaboration**: Real-time editing
6. **Version Control**: Full diagram versioning
7. **Approval Workflow**: Multi-stage approval process
8. **Analytics**: Process metrics dashboard

### Performance Optimizations

- Implement virtual scrolling for large diagrams
- Add debounced autosave
- Cache frequently accessed diagrams
- Lazy load connections

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Verify connection
psql -h localhost -p 5432 -U youruser -d magna_turbo
```

### Prisma Client Out of Sync

```bash
cd apps/api
npx prisma generate
```

### API Not Starting

```bash
# Check if port 3001 is in use
lsof -i :3001

# Check logs
cd apps/api
pnpm dev
```

### Frontend Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
pnpm build
```

## Code Quality

### Linting

```bash
pnpm lint        # ESLint check
pnpm format      # Prettier format
```

### Type Safety

- Full TypeScript coverage
- Prisma-generated types
- Zod validation (future)

## Contributing

1. Follow existing patterns
2. Add tests for new features
3. Update documentation
4. Run linter before commit
5. Keep commits atomic

## License

Internal Orange Group project - All rights reserved.

---

**Built with ❤️ following Clean Architecture & SOLID principles**
