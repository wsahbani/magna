import { useState } from 'react'
import { 
  WorkspaceCard, 
  WorkspaceGrid,
  ProcessCard,
  ProcessGrid,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Label
} from '@repo/ui'
import '@repo/ui/globals.css'

// Sample data
const sampleWorkspaces = [
  {
    id: '1',
    name: 'Orange Tunisie',
    description: 'Main Orange entity in Tunisia',
    type: 'ENTITY' as const,
    processCount: 45,
    memberCount: 150,
    isActive: true,
  },
  {
    id: '2', 
    name: 'IT Department',
    description: 'Information Technology services',
    type: 'DEPARTMENT' as const,
    processCount: 12,
    memberCount: 25,
    isActive: true,
  },
  {
    id: '3',
    name: 'HR Department', 
    description: 'Human Resources management',
    type: 'DEPARTMENT' as const,
    processCount: 8,
    memberCount: 15,
    isActive: true,
  }
]

const sampleProcesses = [
  {
    id: '1',
    name: 'Customer Onboarding Process',
    description: 'Complete process for new customer registration and activation',
    type: 'PROCESSUS' as const,
    level: 1 as const,
    status: 'PUBLISHED' as const,
    priority: 'HIGH' as const,
    authorName: 'John Doe',
    updatedAt: '2024-01-15',
    estimatedDuration: 45,
    tags: ['customer', 'onboarding', 'registration'],
  },
  {
    id: '2',
    name: 'Document Validation',
    description: 'Validate customer identification documents',
    type: 'INSTRUCTION' as const,
    level: 3 as const,
    status: 'DRAFT' as const,
    priority: 'MEDIUM' as const,
    authorName: 'Jane Smith',
    updatedAt: '2024-01-14',
    estimatedDuration: 15,
    tags: ['validation', 'documents', 'compliance'],
  },
  {
    id: '3',
    name: 'Service Activation',
    description: 'Activate customer services and configure account',
    type: 'PROCEDURE' as const,
    level: 2 as const,
    status: 'REVIEW' as const,
    priority: 'HIGH' as const,
    authorName: 'Mike Johnson',
    updatedAt: '2024-01-13',
    estimatedDuration: 30,
    tags: ['activation', 'services', 'configuration'],
  }
]

function App() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>()
  const [selectedProcess, setSelectedProcess] = useState<string>()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Orange Process Management System
          </h1>
          <p className="text-lg text-gray-600">
            Modern UI Components with shadcn/ui for Process Management
          </p>
        </div>

        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-select">Selected Workspace</Label>
                <Input 
                  id="workspace-select"
                  value={selectedWorkspace || ''} 
                  placeholder="Click a workspace below"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="process-select">Selected Process</Label>
                <Input 
                  id="process-select"
                  value={selectedProcess || ''} 
                  placeholder="Click a process below"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex gap-2">
                  <Button variant="orange" size="sm">
                    Create New
                  </Button>
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workspaces Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Workspaces</h2>
          <WorkspaceGrid
            workspaces={sampleWorkspaces}
            selectedWorkspaceId={selectedWorkspace}
            onWorkspaceSelect={setSelectedWorkspace}
          />
        </div>

        {/* Processes Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Processes</h2>
          <ProcessGrid
            processes={sampleProcesses}
            selectedProcessId={selectedProcess}
            onProcessSelect={setSelectedProcess}
            onProcessEdit={(id) => alert(`Edit process: ${id}`)}
            onProcessView={(id) => alert(`View process: ${id}`)}
          />
        </div>

        {/* Button Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="orange">Orange</Button>
              <Button variant="orange-outline">Orange Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>

        {/* Individual Component Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              isSelected={selectedWorkspace === workspace.id}
              onClick={() => setSelectedWorkspace(workspace.id)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProcesses.map((process) => (
            <ProcessCard
              key={process.id}
              process={process}
              isSelected={selectedProcess === process.id}
              onClick={() => setSelectedProcess(process.id)}
              onEdit={() => alert(`Edit: ${process.name}`)}
              onView={() => alert(`View: ${process.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App