import React, { useState } from 'react';
import { SipocElement } from '../types/sipoc.types';

interface SortableElementCardProps {
  element: SipocElement;
  index: number;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onUpdate: (updates: Partial<SipocElement>) => void;
  onDelete: () => void;
  isEditable?: boolean;
}

export const SortableElementCard: React.FC<SortableElementCardProps> = ({
  element,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onUpdate,
  onDelete,
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(element.title);
  const [editedDescription, setEditedDescription] = useState(element.description || '');

  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate({
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(element.title);
    setEditedDescription(element.description || '');
    setIsEditing(false);
  };

  return (
    <div
      draggable={isEditable && !isEditing}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`bg-white border rounded-lg p-3 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } hover:shadow-md transition-shadow`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            autoFocus
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{element.title}</h4>
              {element.description && (
                <p className="text-xs text-gray-600 mt-1">{element.description}</p>
              )}
            </div>
            {isEditable && (
              <div className="flex gap-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 hover:text-blue-700 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
