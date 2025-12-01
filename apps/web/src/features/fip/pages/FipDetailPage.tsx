import { useParams } from '@tanstack/react-router';
import { FipEditor } from '../components/FipEditor';

export default function FipDetailPage() {
  const { processId } = useParams({ from: '/processes/$processId/fip' });

  return <FipEditor processId={processId} />;
}

