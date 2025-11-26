import { createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router'
import { LoginPage } from './features/auth'
import { AdminLayout } from './layouts/AdminLayout'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { WorkspacesPage } from './features/workspaces/pages/WorkspacesPage'
import WorkspaceDetailPage from './features/workspaces/pages/WorkspaceDetailPage'
import ProcessesPage from './features/processes/pages/ProcessesPage'
import FlowDetailPage from './features/processes/pages/FlowDetailPage'
import SipocDetailPage from './features/processes/pages/SipocDetailPage'
import BpmnDetailPage from './features/processes/pages/BpmnDetailPage'
import { SipocListPage, SipocEditor } from './features/sipoc'

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken')
}

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Login route (no layout) - redirect to dashboard if already authenticated
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

// Dashboard route with admin layout - protected route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  ),
})

// Workspaces route with admin layout - protected route
const workspacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <WorkspacesPage />
    </AdminLayout>
  ),
})

// Workspace detail route with admin layout - protected route
const workspaceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <WorkspaceDetailPage />
    </AdminLayout>
  ),
})

// Processes route with admin layout - protected route
const processesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <ProcessesPage />
    </AdminLayout>
  ),
})

// Flow detail route - protected route
const flowDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes/flow/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
   
      <FlowDetailPage />
  
  ),
})

// SIPOC detail route - protected route
const sipocDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes/sipoc/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <SipocDetailPage />
    </AdminLayout>
  ),
})

// BPMN detail route - protected route
const bpmnDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes/bpmn/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <BpmnDetailPage />
    </AdminLayout>
  ),
})

// New SIPOC list route - protected route
const sipocListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sipoc',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <SipocListPage userId="temp-user-id" />
    </AdminLayout>
  ),
})

// New SIPOC editor route - protected route
// Create route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  workspacesRoute,
  workspaceDetailRoute,
  processesRoute,
  flowDetailRoute,
  sipocDetailRoute,
  bpmnDetailRoute,
  sipocListRoute,
])

// Create and export router instance
export const router = createRouter({ 
  routeTree,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}