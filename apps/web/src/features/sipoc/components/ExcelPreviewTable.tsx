/**
 * Excel Preview Table
 * Displays imported Excel data in an editable table format
 */

import { useState } from 'react';
import { Button } from '@repo/ui';
import { BodySmall, Caption } from '@repo/ui';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import type { ParsedSipocRow } from '../utils/excel-parser';

interface ExcelPreviewTableProps {
  rows: ParsedSipocRow[];
  onRowUpdate: (rowIndex: number, updatedRow: ParsedSipocRow) => void;
  onRowDelete: (rowIndex: number) => void;
  onCellUpdate: (rowIndex: number, columnType: ColumnType, cellIndex: number, newValue: string) => void;
  onCellDelete: (rowIndex: number, columnType: ColumnType, cellIndex: number) => void;
}

type ColumnType = 'suppliers' | 'inputs' | 'processes' | 'outputs' | 'customers';

const COLUMNS: { key: ColumnType; label: string; color: string }[] = [
  { key: 'suppliers', label: 'Fournisseurs', color: 'bg-purple-50 border-purple-200' },
  { key: 'inputs', label: 'Entrées', color: 'bg-blue-50 border-blue-200' },
  { key: 'processes', label: 'Processus', color: 'bg-orange-50 border-orange-200' },
  { key: 'outputs', label: 'Sorties', color: 'bg-green-50 border-green-200' },
  { key: 'customers', label: 'Clients', color: 'bg-pink-50 border-pink-200' },
];

export const ExcelPreviewTable = ({
  rows,
  onRowUpdate,
  onRowDelete,
  onCellUpdate,
  onCellDelete,
}: ExcelPreviewTableProps) => {
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    column: ColumnType;
    cellIndex: number;
    value: string;
  } | null>(null);

  const handleStartEdit = (rowIndex: number, column: ColumnType, cellIndex: number, currentValue: string) => {
    setEditingCell({ rowIndex, column, cellIndex, value: currentValue });
  };

  const handleSaveEdit = () => {
    if (editingCell) {
      onCellUpdate(editingCell.rowIndex, editingCell.column, editingCell.cellIndex, editingCell.value);
      setEditingCell(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  const handleDeleteCell = (rowIndex: number, column: ColumnType, cellIndex: number) => {
    onCellDelete(rowIndex, column, cellIndex);
  };

  const renderCell = (row: ParsedSipocRow, rowIndex: number, column: ColumnType) => {
    const cells = row[column];
    
    if (cells.length === 0) {
      return (
        <div className="text-gray-400 italic text-sm p-2">
          Vide
        </div>
      );
    }

    return (
      <div className="space-y-1 p-2">
        {cells.map((cell, cellIndex) => {
          const isEditing = 
            editingCell?.rowIndex === rowIndex &&
            editingCell?.column === column &&
            editingCell?.cellIndex === cellIndex;

          return (
            <div
              key={cellIndex}
              className="group flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:border-orange-300 transition-colors"
            >
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editingCell.value}
                    onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="text-green-600 hover:text-green-700"
                    title="Enregistrer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-600 hover:text-gray-700"
                    title="Annuler"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <BodySmall className="flex-1 text-gray-900">{cell}</BodySmall>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(rowIndex, column, cellIndex, cell)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Modifier"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteCell(rowIndex, column, cellIndex)}
                      className="text-red-600 hover:text-red-700"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="w-12 px-2 py-3 border-b border-r border-gray-200">
                <Caption className="font-semibold text-gray-700">#</Caption>
              </th>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 border-b border-r border-gray-200 text-left ${column.color}`}
                >
                  <Caption className="font-semibold text-gray-900">
                    {column.label}
                  </Caption>
                </th>
              ))}
              <th className="w-20 px-2 py-3 border-b border-gray-200">
                <Caption className="font-semibold text-gray-700">Actions</Caption>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr
                key={row.flowId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-2 py-2 border-r border-gray-200 text-center">
                  <Caption className="text-gray-500 font-medium">
                    {rowIndex + 1}
                  </Caption>
                </td>
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className="px-2 py-2 border-r border-gray-200 align-top min-w-[200px]"
                  >
                    {renderCell(row, rowIndex, column.key)}
                  </td>
                ))}
                <td className="px-2 py-2 text-center">
                  <button
                    onClick={() => onRowDelete(rowIndex)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                    title="Supprimer la ligne"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-12">
          <BodySmall className="text-gray-500">
            Aucune donnée à afficher
          </BodySmall>
        </div>
      )}
    </div>
  );
};
