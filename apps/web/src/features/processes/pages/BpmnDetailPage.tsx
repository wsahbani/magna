import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button, Heading1, Body } from '@repo/ui'

export default function BpmnDetailPage() {
  const { id } = useParams({ from: '/processes/bpmn/$id' })
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/processes' })}
          className="mt-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <Heading1 className="text-gray-900">BPMN Process Detail</Heading1>
          <Body className="text-gray-600 mt-2">Process ID: {id}</Body>
        </div>
      </div>

      {/* Empty content placeholder */}
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Body className="text-gray-500">
          BPMN process detail page - Coming soon
        </Body>
      </div>
    </div>
  )
}
