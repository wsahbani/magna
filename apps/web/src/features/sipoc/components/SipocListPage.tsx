import React, { useEffect, useState } from 'react';
import { useSipocStore } from '../store/sipocStore';
import { Button } from '@repo/ui';
import { Card } from '@repo/ui';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';


interface SipocListPageProps {
  userId: string;
}

export const SipocListPage: React.FC<SipocListPageProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { diagrams, fetchDiagrams, createDiagram, isLoading } = useSipocStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDiagramTitle, setNewDiagramTitle] = useState('');
  const [newDiagramDescription, setNewDiagramDescription] = useState('');

  useEffect(() => {
    fetchDiagrams(userId);
  }, [userId, fetchDiagrams]);

  const handleCreateDiagram = async () => {
    if (!newDiagramTitle.trim()) return;

    try {
      const diagram = await createDiagram(
        {
          title: newDiagramTitle,
          description: newDiagramDescription || undefined,
        },
        userId
      );
      setShowCreateDialog(false);
      setNewDiagramTitle('');
      setNewDiagramDescription('');
      navigate({ to: `/sipoc/${diagram.sipoc_id}` });
    } catch (error) {
      console.error('Failed to create diagram:', error);
    }
  };

  const diagramsList = Object.values(diagrams);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">SIPOC Diagrams</h1>
          <p className="text-gray-600 mt-2">
            Supplier, Input, Process, Output, Customer analysis
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New SIPOC
        </Button>
      </div>

      {showCreateDialog && (
        <Card className="mb-6 p-6">
          <h3 className="text-lg font-semibold mb-4">Create New SIPOC Diagram</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newDiagramTitle}
                onChange={(e) => setNewDiagramTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter diagram title"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description (optional)
              </label>
              <textarea
                value={newDiagramDescription}
                onChange={(e) => setNewDiagramDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md resize-none"
                rows={3}
                placeholder="Enter diagram description"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewDiagramTitle('');
                  setNewDiagramDescription('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateDiagram}
                disabled={!newDiagramTitle.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading diagrams...</p>
        </div>
      ) : diagramsList.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No SIPOC diagrams yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first SIPOC diagram
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create SIPOC
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagramsList.map((diagram) => (
            <Card
              key={diagram.sipoc_id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate({ to: `/sipoc/${diagram.sipoc_id}` }  )}
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    diagram.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {diagram.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{diagram.title}</h3>
              {diagram.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {diagram.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Version {diagram.version}</span>
                <span>
                  {new Date(diagram.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
