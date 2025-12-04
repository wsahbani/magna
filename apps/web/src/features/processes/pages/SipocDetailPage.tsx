import { useParams, useSearch } from '@tanstack/react-router'
import { SipocEditor, useSipocDiagramsByProcessId } from '../../sipoc'

export default function SipocDetailPage() {
  const { id } = useParams({ from: '/processes/sipoc/$id' })
  const search : any= useSearch({ from: '/processes/sipoc/$id' })
  console.log("search params in sipoc detail page", search)
    const { data: sipoc ,isLoading} = useSipocDiagramsByProcessId(id)
  const sipocId = sipoc?.sipoc_id;

  if (isLoading) {
    return <div>Loading...</div>
  } if (!sipocId && search?.sipoc !== true) {
    return <div>No SIPOC diagram found for this process.</div>
  }
  
  const _sipocId = search?.sipoc == true ? id : sipocId;

  if(!_sipocId){
    return <div>No SIPOC diagram found for this process.</div>
  }
  return (
    <div className="p-4">
     <SipocEditor sipocId={_sipocId} />
    </div>
  )
}
