# Process Manager Orange - Documentation

## Architecture Overview

This is a **Process Management System** built with **NestJS**, **Prisma**, and **React** in a **Turborepo monorepo**. The system manages business processes following the PYX4 methodology for process modeling and documentation.

## � Form Styling System (NEW!)

Modern form components with visual validation based on the design system:

- **[Quick Start](./form-styling-quickstart.md)** - Get started in 5 minutes ⚡
- **[Complete Guide](./form-styling-guide.md)** - Detailed documentation with examples 📚
- **[Before/After](./form-transformation-guide.md)** - See the improvements 📊
- **[Visual Result](./VISUAL_RESULT.md)** - ASCII mockup of final result 🎨
- **[Implementation](./FORM_STYLE_IMPLEMENTATION.md)** - Technical overview 🔧

**New Components**: `ValidatedInput`, `ValidatedSelect` with automatic green checkmarks ✅
## 📐 Layout Components (NEW!)

Reusable layout components for consistent page structure:

- **[PageWrapper Guide](./page-wrapper-component.md)** - Complete documentation 📚
- **[Quick Summary](./PAGE_WRAPPER_SUMMARY.md)** - TL;DR version ⚡

**New Component**: `PageWrapper` with breadcrumbs, title, description, and actions 🎯
## �🆕 Recent Enhancements

### Flow Builder with Advanced Features
- ✅ **Resizable Nodes**: All nodes can be resized with min/max constraints
- ✅ **Visual Properties Panel**: User-friendly styling controls (no technical knowledge required)
- ✅ **Zustand State Management**: Robust, centralized flow state with API integration ready
- ✅ **Complete CRUD Operations**: Add, update, delete nodes and edges
- ✅ **Advanced Operations**: Duplicate, align, distribute nodes
- ✅ **Dirty State Tracking**: Automatic unsaved changes detection
- ✅ **DevTools Integration**: Redux DevTools support for debugging
- ✅ **Custom Node Rendering**: Database, API Call, and Conditional nodes with specialized UI

## Core Concepts

### Process Hierarchy
- **Level 1**: Processus (High-level business processes)
- **Level 2**: Procédures (Detailed procedures)
- **Level 3**: Instructions (Specific work instructions)

### Process Lifecycle
1. **DRAFT** - Initial creation and editing
2. **REVIEW** - Under review by stakeholders
3. **APPROVED** - Approved for publication
4. **PUBLISHED** - Active and in use
5. **ARCHIVED** - No longer active

### Key Features
- **Process Versioning**: Complete version control with draft/published states
- **Diagram Modeling**: Visual process diagrams with nodes and edges (ReactFlow)
- **Role-based Access**: INTERNE/EXTERNE role types with unit assignments
- **Collaboration**: Comments, approvals, and reading confirmations
- **Document Management**: Linked documents and means
- **Audit Trail**: Complete journal of all process changes
- **Visual Flow Editor**: Drag-and-drop diagram builder with advanced styling

## Technical Stack

### Backend (NestJS)
- **Clean Architecture**: Modular structure with separation of concerns
- **SOLID Principles**: Dependency injection, single responsibility
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Primary database
- **Validation**: Class-validator for DTO validation
- **Exception Handling**: Custom business exceptions

### Frontend (React + Vite)
- **Component Library**: Shared UI components in `@repo/ui`
- **TypeScript**: Full type safety
- **Modular Architecture**: Feature-based organization
- **State Management**: Zustand for flow state
- **React Query**: Server state management
- **ReactFlow**: Visual diagram editor
- **Tailwind CSS**: Utility-first styling

### Database Schema
- **Process Management**: Core process hierarchy and versioning
- **Diagram Modeling**: Nodes, edges, and flow logic (stored as JSON)
- **Collaboration**: Comments, approvals, assignments
- **Document Management**: File attachments and references
- **Audit & Journal**: Complete change tracking

## Documentation Index

### Getting Started
- [Development Guide](./development.md) - Setup and development workflow
- [API Documentation](./api.md) - REST API reference

### Flow Builder System
- **[Flow Store](./flow-store.md)** - Complete state management guide
- **[Quick Start](./flow-store-quickstart.md)** - Get started with Zustand store
- **[Implementation Summary](./zustand-implementation-summary.md)** - What was built
- [Flow Builder Component](./flow-builder-component.md) - ReactFlow integration
- [Custom Render Examples](./custom-render-examples.md) - Custom node development
- [Flow Editor Implementation](./flow-editor-implementation.md) - Editor page guide
- [ReactFlow Integration](./reactflow-integration.md) - Technical integration details

### Architecture
- [Base Node Architecture](./base-node-architecture.md) - Node system design
- [Process Module](./process-module.md) - Backend process management
- [Workspace Module](./workspace-module.md) - Workspace management
- [Authentication](./authentication.md) - Auth system
- [Auth Feature](./auth-feature.md) - Frontend auth implementation

### Database
- [Enhanced Schema](./enhanced-schema.md) - Complete data model
- [Database Guide](./database.md) - Database details

## Quick Reference

### Flow Store Usage
```tsx
import { useFlowStore } from '@/stores'

const { nodes, edges, addNode, addEdge } = useFlowStore()
```

### Flow Operations
```tsx
import { useFlowOperations } from '@/stores'

const { 
  createNode, 
  duplicateSelected, 
  alignNodes,
  deleteSelected 
} = useFlowOperations()
```

### API Integration
```tsx
import { useFlowApi } from '@/stores'

const { 
  saveFlow, 
  validateFlow, 
  exportFlowAsJson 
} = useFlowApi()
```

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `pnpm install`
3. **Setup database**: See [Development Guide](./development.md)
4. **Start development**: `pnpm dev`
5. **Open browser**: 
   - Frontend: http://localhost:5173
   - API: http://localhost:3001

## Project Structure

```
apps/
├── web/              # React frontend
│   ├── src/
│   │   ├── components/   # Shared components
│   │   │   └── FlowBuilder/  # Flow editor system
│   │   ├── features/     # Feature modules
│   │   ├── stores/       # Zustand stores
│   │   ├── lib/          # API clients
│   │   └── layouts/      # Page layouts
│   └── package.json
│
├── api/              # NestJS backend
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── common/       # Shared utilities
│   │   └── database/     # Prisma client
│   ├── prisma/           # Database schema
│   └── package.json
│
packages/
├── ui/               # Shared UI components
├── typescript-config/ # Shared TS configs
└── eslint-config/    # Shared ESLint configs

docs/                 # Documentation
```

## Development Principles

### SOLID Principles
- **S**ingle Responsibility: Each class/function has one purpose
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Interfaces are interchangeable
- **I**nterface Segregation: Many specific interfaces vs one general
- **D**ependency Inversion: Depend on abstractions, not concretions

### Clean Architecture
- **Separation of Concerns**: Clear boundaries between layers
- **Dependency Rule**: Dependencies point inward
- **Testability**: Business logic isolated from frameworks
- **Maintainability**: Easy to understand and modify

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Testing**: Unit and E2E tests
- **Documentation**: Comprehensive docs

## Contributing

1. Follow the existing code structure
2. Maintain TypeScript strict mode
3. Write clear commit messages
4. Update documentation
5. Test your changes

## License

[Your License Here]
```