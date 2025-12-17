import { useParams } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { Body } from '@repo/ui'
import { PageWrapper } from '../../../components/layout'

export default function BpmnDetailPage() {
  const { id } = useParams({ from: '/processes/bpmn/$id' })

  return (
    <PageWrapper
      title="BPMN Process Detail"
      description={`Process ID: ${id}`}
      breadcrumbs={[
        { label: 'Processus', href: '/processes', icon: <FileText /> },
        { label: 'BPMN', icon: <FileText /> },
      ]}
    >

      {/* Empty content placeholder */}
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Body className="text-gray-500">
          BPMN process detail page - Coming soon
        </Body>
      </div>
    </PageWrapper>
  )
}
