import { createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router'
import { LoginPage } from './features/auth'
import { AdminLayout } from './layouts/AdminLayout'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { WorkspacesPage } from './features/workspaces/pages/WorkspacesPage'
import WorkspaceDetailPage from './features/workspaces/pages/WorkspaceDetailPage'
// DEPRECATED: Old processes feature - replaced by features/process
// import ProcessesPage from './features/processes/pages/ProcessesPage'
// import FlowDetailPage from './features/processes/pages/FlowDetailPage'
import SipocDetailPage from './features/processes/pages/SipocDetailPage'
// import BpmnDetailPage from './features/processes/pages/BpmnDetailPage'
import FipDetailPage from './features/fip/pages/FipDetailPage'
import { SipocListPage } from './features/sipoc'
import { UsersPage } from './features/users'
import { GroupsPage } from './features/groups/pages/GroupsPage'
import { MacroProcessListPage } from './features/macro-processes/pages/MacroProcessListPage'
// Procedures (Level 3) feature
import ProcedureDetailPage from './features/procedures/pages/ProcedureDetailPage'
import ProcedureFlowEditorPage from './features/procedures/pages/ProcedureFlowEditorPage'
import ProceduresPage from './features/procedures/pages/ProceduresPage'
// DEPRECATED: Qualigram - needs migration to new architecture
// import QualigramEditorPage from './features/qualigram/pages/QualigramEditorPage'
import ProcessMapsPage from './features/process-map/pages/ProcessMapsPage'
import ProcessMapDetailPage from './features/process-map/pages/ProcessMapDetailPage'
import ProcessMapFlowEditorPage from './features/process-map/pages/ProcessMapFlowEditorPage'
import ProcessesPageLevel2 from './features/process/pages/ProcessesPage'
import ProcessDetailPageLevel2 from './features/process/pages/ProcessDetailPage'
import ProcessFlowEditorPageLevel2 from './features/process/pages/ProcessFlowEditorPage'
import { SettingsPage } from './features/settings/pages/SettingsPage'

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

// Settings route with admin layout - protected route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <SettingsPage />
    </AdminLayout>
  ),
})

// Processes route with admin layout - protected route
// const processesRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/processes',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//     <AdminLayout>
//       <ProcessesPage />
//     </AdminLayout>
//   ),
// })
// 
// // Flow detail route - protected route
// const flowDetailRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/processes/flow/$id',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//    
//       <FlowDetailPage />
//   
//   ),
// })
// 
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
// 
// // BPMN detail route - protected route
// const bpmnDetailRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/processes/bpmn/$id',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//     <AdminLayout>
//       <BpmnDetailPage />
//     </AdminLayout>
//   ),
// })
// 
// // New SIPOC list route - protected route
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

// FIP detail route - protected route
const fipDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes/$processId/fip',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <FipDetailPage />
    </AdminLayout>
  ),
})

// Users route - protected route (Admin only in backend)
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  ),
})

// Groups route - protected route (Admin only in backend)
const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/groups',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <GroupsPage />
    </AdminLayout>
  ),
})

// MacroProcess route - protected route
const macroProcessesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/macro-processes',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <MacroProcessListPage />
    </AdminLayout>
  ),
})

// Procedure detail route - protected route
// const procedureDetailRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/procedures/$id',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//     <AdminLayout>
//       <ProcedureDetailPage />
//     </AdminLayout>
//   ),
// })
// 
// // ProcessMaps route - protected route
const processMapsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/process-maps',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <ProcessMapsPage />
    </AdminLayout>
  ),
})

// ProcessMap detail route - protected route
const processMapDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/process-maps/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <ProcessMapDetailPage />
    </AdminLayout>
  ),
})

// ProcessMap Flow Editor route - protected route (full-screen, no layout)
const processMapFlowEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/process-maps/$id/flow',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <ProcessMapFlowEditorPage />,
})

// Process (Level 2) routes - protected routes
const processesLevel2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes-level2',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <ProcessesPageLevel2 />
    </AdminLayout>
  ),
})

// Process (Level 2) detail route - protected route
const processDetailLevel2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes-level2/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <ProcessDetailPageLevel2 />
    </AdminLayout>
  ),
})

// Process (Level 2) Flow Editor route - protected route (full-screen, no layout)
const processFlowEditorLevel2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processes-level2/$id/flow',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <ProcessFlowEditorPageLevel2 />,
})

// Procedure (Level 3) routes - protected routes
const proceduresLevel3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/procedures-level3',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <ProceduresPage />
    </AdminLayout>
  ),
})

// Procedure (Level 3) detail route - protected route
const procedureDetailLevel3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/procedures-level3/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <ProcedureDetailPage />
    </AdminLayout>
  ),
})

// Procedure (Level 3) Flow Editor route - protected route (full-screen, no layout)
const procedureFlowEditorLevel3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/procedures-level3/$id/flow',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <ProcedureFlowEditorPage />,
})
// 
// // Qualigram Editor route - protected route
// const qualigramEditorRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/qualigram/editor',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//     <AdminLayout>
//       <QualigramEditorPage />
//     </AdminLayout>
//   ),
// })
// 
// // Qualigram Editor with MacroProcess route
// const qualigramEditorWithMacroRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/qualigram/editor/$macroProcessId',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//     <AdminLayout>
//       <QualigramEditorPage />
//     </AdminLayout>
//   ),
// })
// 
// // Qualigram Editor with Process route
// const qualigramEditorWithProcessRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/qualigram/editor/$macroProcessId/$processId',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//     <AdminLayout>
//       <QualigramEditorPage />
//     </AdminLayout>
//   ),
// })
// 
// // Qualigram Editor with Procedure route
// const qualigramEditorWithProcedureRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/qualigram/editor/$macroProcessId/$processId/$procedureId',
//   beforeLoad: () => {
//     if (!isAuthenticated()) {
//       throw redirect({ to: '/login' })
//     }
//   },
//   component: () => (
//     <AdminLayout>
//       <QualigramEditorPage />
//     </AdminLayout>
//   ),
// })
// 
// // Create route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  workspacesRoute,
  workspaceDetailRoute,
  settingsRoute,
  // processesRoute,
  // flowDetailRoute,
  sipocDetailRoute,
  // bpmnDetailRoute,
  sipocListRoute,
  fipDetailRoute,
  usersRoute,
  groupsRoute,
  macroProcessesRoute,
  // procedureDetailRoute,
  processMapsRoute,
  processMapDetailRoute,
  processMapFlowEditorRoute,
  processesLevel2Route,
  processDetailLevel2Route,
  processFlowEditorLevel2Route,
  proceduresLevel3Route,
  procedureDetailLevel3Route,
  procedureFlowEditorLevel3Route,
  // qualigramEditorRoute,
  // qualigramEditorWithMacroRoute,
  // qualigramEditorWithProcessRoute,
  // qualigramEditorWithProcedureRoute,
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