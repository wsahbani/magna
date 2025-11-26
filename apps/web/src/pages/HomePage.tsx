import { useState } from 'react'
import { 
  WorkspaceGrid,
  ProcessGrid,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Label
} from '@repo/ui'

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
]

export function HomePage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>()
  const [selectedProcess, setSelectedProcess] = useState<string>()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🚀 Orange Process Management
          </h1>
          <p className="text-lg text-gray-600">
            <strong>Step 2:</strong> TanStack Router Setup Complete!
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✅ TanStack Router Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Selected Workspace</Label>
                <Input 
                  value={selectedWorkspace ? `Workspace ${selectedWorkspace}` : ''} 
                  placeholder="Click a workspace below"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Next Steps</Label>
                <div className="flex gap-2">
                  <Button variant="orange" size="sm">
                    Add TanStack Query
                  </Button>
                  <Button variant="outline" size="sm">
                    Add TanStack Table
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
      </div>
    </div>
  )
}