/**
 * SwimlaneNode Component
 * Unified component for BPMN swimlanes (Pool with Lanes)
 * Lanes are stored in data.lanes array, not as separate nodes
 * Supports vertical and horizontal orientations
 */

import { memo, useState, useCallback } from 'react';
import { NodeResizer, Handle, Position, NodeProps } from '@xyflow/react';
import { Plus, Trash2, GripVertical, GripHorizontal, RotateCw } from 'lucide-react';
import type { PoolNodeData, LaneData, SwimlaneOrientation } from '../../../features/procedures/types/flow-diagram.types';

interface SwimlaneNodeProps extends NodeProps {
  data: PoolNodeData;
}

const SwimlaneNode = memo(({ id, data, selected, width, height }: SwimlaneNodeProps) => {
  const [isEditingPool, setIsEditingPool] = useState(false);
  const [poolLabel, setPoolLabel] = useState(data.label || 'Pool');
  const [editingLane, setEditingLane] = useState<string | null>(null);
  const [laneLabels, setLaneLabels] = useState<Record<string, string>>({});

  const lanes = data.lanes || [];
  const orientation: SwimlaneOrientation = data.orientation || 'vertical';
  const isVertical = orientation === 'vertical';

  // Lane colors for visual distinction
  const laneColors = [
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-yellow-50',
    'bg-pink-50',
  ];

  // Horizontal layout (lanes stacked vertically)
  if (!isVertical) {
    return (
      <div className="relative" style={{ width: width || '100%', height: height || '100%' }}>
        {selected && (
          <div style={{ pointerEvents: 'auto' }}>
            <NodeResizer
              minWidth={600}
              minHeight={150}
              maxWidth={undefined}
              maxHeight={undefined}
              isVisible={selected}
              lineClassName="!border-orange-500 !pointer-events-auto"
              handleClassName="!w-3 !h-3 !bg-orange-500 !border-2 !border-white !pointer-events-auto"
            />
          </div>
        )}

        <div
          className={`bg-white border-2 rounded-lg overflow-hidden shadow-xl transition-shadow ${
            selected ? 'border-orange-500 shadow-lg ring-4 ring-orange-400 ring-opacity-50' : 'border-gray-300'
          }`}
          style={{
            width: width || '100%',
            height: height || '100%',
            minWidth: 600,
            backgroundColor: data.color || '#f3f4f6',
          }}
        >
          {/* Pool header (left side) */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-700 border-r border-gray-500 flex items-center justify-center">
            <div
              className="transform -rotate-90 whitespace-nowrap cursor-pointer"
              onDoubleClick={() => setIsEditingPool(true)}
            >
              {isEditingPool ? (
                <input
                  type="text"
                  value={poolLabel}
                  onChange={(e) => setPoolLabel(e.target.value)}
                  onBlur={() => {
                    setIsEditingPool(false);
                    data.onLabelChange?.(poolLabel);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingPool(false);
                      data.onLabelChange?.(poolLabel);
                    }
                  }}
                  className="text-sm font-semibold bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-900"
                  autoFocus
                />
              ) : (
                <span className="text-sm font-semibold text-white">{poolLabel}</span>
              )}
            </div>
          </div>

          {/* Lanes container (stacked vertically) */}
          <div className="ml-10 h-full flex flex-col">
            {lanes.map((lane, index) => {
              const colorClass = laneColors[index % laneColors.length];
              const isCollapsed = lane.collapsed || false;

              return (
                <div
                  key={lane.id}
                  className={`relative ${colorClass} border-b border-gray-300 last:border-b-0 group`}
                  style={{
                    height: isCollapsed ? 40 : lane.size,
                    backgroundColor: lane.color,
                  }}
                >
                  {/* Lane label */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-200/50 border-r border-gray-300/50 flex items-center justify-center">
                    <div
                      className="transform -rotate-90 whitespace-nowrap cursor-pointer"
                      onDoubleClick={() => setEditingLane(lane.id)}
                    >
                      {editingLane === lane.id ? (
                        <input
                          type="text"
                          value={laneLabels[lane.id] ?? lane.label}
                          onChange={(e) =>
                            setLaneLabels({ ...laneLabels, [lane.id]: e.target.value })
                          }
                          onBlur={() => {
                            setEditingLane(null);
                            data.onLaneLabelChange?.(id, lane.id, laneLabels[lane.id] ?? lane.label);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingLane(null);
                              data.onLaneLabelChange?.(id, lane.id, laneLabels[lane.id] ?? lane.label);
                            }
                          }}
                          className="text-xs bg-white border border-gray-300 rounded px-1 text-gray-900"
                          autoFocus
                        />
                      ) : (
                        <span className="text-xs text-gray-600">{laneLabels[lane.id] ?? lane.label}</span>
                      )}
                    </div>
                  </div>

                  {/* Lane content area */}
                  {!isCollapsed && (
                    <div className="ml-8 h-full relative">
                      {/* Lane actions (visible on hover) */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        {lanes.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              data.onRemoveLane?.(id, lane.id);
                            }}
                            className="p-1 rounded bg-red-500/80 hover:bg-red-600 text-white"
                            title="Supprimer Lane"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Resize handle at bottom of each lane */}
                      {index < lanes.length - 1 && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize bg-transparent hover:bg-orange-500/20 group/resize flex items-center justify-center"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const startY = e.clientY;
                            const startSize = lane.size;

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const deltaY = moveEvent.clientY - startY;
                              const newSize = Math.max(100, startSize + deltaY);
                              data.onLaneResize?.(id, lane.id, newSize);
                            };

                            const handleMouseUp = () => {
                              document.removeEventListener('mousemove', handleMouseMove);
                              document.removeEventListener('mouseup', handleMouseUp);
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                          }}
                        >
                          <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover/resize:opacity-100" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="absolute bottom-2 right-2 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onToggleOrientation?.(id);
              }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-lg transition-all hover:scale-105"
              title="Changer l'orientation"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onAddLane?.(id);
              }}
              className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all hover:scale-105"
              title="Ajouter une Lane"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (lanes stacked horizontally)
  return (
    <div className="relative" style={{ width: width || '100%', height: height || '100%' }}>
      {selected && (
        <div style={{ pointerEvents: 'auto' }}>
          <NodeResizer
            minWidth={150}
            minHeight={400}
            maxWidth={undefined}
            maxHeight={undefined}
            isVisible={selected}
            lineClassName="!border-orange-500 !pointer-events-auto"
            handleClassName="!w-3 !h-3 !bg-orange-500 !border-2 !border-white !pointer-events-auto"
          />
        </div>
      )}

      <div
        className={`bg-white border-2 rounded-lg overflow-hidden shadow-xl transition-shadow ${
          selected ? 'border-orange-500 shadow-lg ring-4 ring-orange-400 ring-opacity-50' : 'border-gray-300'
        }`}
        style={{
          width: width || '100%',
          height: height || '100%',
          minHeight: 400,
          backgroundColor: data.color || '#f3f4f6',
        }}
      >
        {/* Pool header (top) */}
        <div className="absolute left-0 top-0 right-0 h-10 bg-gray-700 border-b border-gray-500 flex items-center justify-center">
          <div
            className="whitespace-nowrap cursor-pointer"
            onDoubleClick={() => setIsEditingPool(true)}
          >
            {isEditingPool ? (
              <input
                type="text"
                value={poolLabel}
                onChange={(e) => setPoolLabel(e.target.value)}
                onBlur={() => {
                  setIsEditingPool(false);
                  data.onLabelChange?.(poolLabel);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingPool(false);
                    data.onLabelChange?.(poolLabel);
                  }
                }}
                className="text-sm font-semibold bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-900"
                autoFocus
              />
            ) : (
              <span className="text-sm font-semibold text-white">{poolLabel}</span>
            )}
          </div>
        </div>

        {/* Lanes container (stacked horizontally) */}
        <div className="mt-10 h-[calc(100%-40px)] flex flex-row">
          {lanes.map((lane, index) => {
            const colorClass = laneColors[index % laneColors.length];
            const isCollapsed = lane.collapsed || false;

            return (
              <div
                key={lane.id}
                className={`relative ${colorClass} border-r border-gray-300 last:border-r-0 group`}
                style={{
                  width: isCollapsed ? 40 : lane.size,
                  backgroundColor: lane.color,
                }}
              >
                {/* Lane label */}
                <div className="absolute left-0 top-0 right-0 h-8 bg-gray-200/50 border-b border-gray-300/50 flex items-center justify-center">
                  <div
                    className="whitespace-nowrap cursor-pointer"
                    onDoubleClick={() => setEditingLane(lane.id)}
                  >
                    {editingLane === lane.id ? (
                      <input
                        type="text"
                        value={laneLabels[lane.id] ?? lane.label}
                        onChange={(e) =>
                          setLaneLabels({ ...laneLabels, [lane.id]: e.target.value })
                        }
                        onBlur={() => {
                          setEditingLane(null);
                          data.onLaneLabelChange?.(id, lane.id, laneLabels[lane.id] ?? lane.label);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingLane(null);
                            data.onLaneLabelChange?.(id, lane.id, laneLabels[lane.id] ?? lane.label);
                          }
                        }}
                        className="text-xs bg-white border border-gray-300 rounded px-1 text-gray-900"
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs text-gray-600">{laneLabels[lane.id] ?? lane.label}</span>
                    )}
                  </div>
                </div>

                {/* Lane content area */}
                {!isCollapsed && (
                  <div className="mt-8 h-[calc(100%-32px)] relative">
                    {/* Lane actions (visible on hover) */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      {lanes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            data.onRemoveLane?.(id, lane.id);
                          }}
                          className="p-1 rounded bg-red-500/80 hover:bg-red-600 text-white"
                          title="Supprimer Lane"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Resize handle at right of each lane */}
                    {index < lanes.length - 1 && (
                      <div
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-orange-500/20 group/resize flex items-center justify-center"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startSize = lane.size;

                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            const deltaX = moveEvent.clientX - startX;
                            const newSize = Math.max(150, startSize + deltaX);
                            data.onLaneResize?.(id, lane.id, newSize);
                          };

                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };

                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        <GripHorizontal className="w-4 h-4 text-gray-400 opacity-0 group-hover/resize:opacity-100 rotate-90" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="absolute bottom-2 right-2 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleOrientation?.(id);
            }}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-lg transition-all hover:scale-105"
            title="Changer l'orientation"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onAddLane?.(id);
            }}
            className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all hover:scale-105"
            title="Ajouter une Lane"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

SwimlaneNode.displayName = 'SwimlaneNode';

export default SwimlaneNode;

