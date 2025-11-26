import { useParams } from '@tanstack/react-router'
import { SipocEditor, useSipocDiagramsByProcessId } from '../../sipoc'

export default function SipocDetailPage() {
  const { id } = useParams({ from: '/processes/sipoc/$id' })
    const { data: sipoc ,isLoading} = useSipocDiagramsByProcessId(id)
  const sipocId = sipoc?.sipoc_id;

  if (isLoading) {
    return <div>Loading...</div>
  } if (!sipocId) {
    return <div>No SIPOC diagram found for this process.</div>
  }

  return (
    <div className="p-4">
     <SipocEditor sipocId={sipocId} />
    </div>
  )
}
