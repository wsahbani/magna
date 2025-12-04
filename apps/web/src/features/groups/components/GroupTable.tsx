/**
 * GroupTable Component
 * Displays groups in table format with sorting and pagination
 */

import { useMemo } from 'react'
import { Group } from '../types/group.types'
import { Badge } from '@repo/ui'
import { Body, BodySmall, Caption } from '@repo/ui'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit, Trash2, Users, Shield } from 'lucide-react'
import { useState } from 'react'

interface GroupTableProps {
  groups: Group[]
  onEdit?: (group: Group) => void
  onDelete?: (group: Group) => void
  isAdmin?: boolean
}

const columnHelper = createColumnHelper<Group>()

export function GroupTable({ groups, onEdit, onDelete, isAdmin }: GroupTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nom
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => {
          const group = info.row.original
          return (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: group.color || '#EA580C' }}
              />
              <Body className="font-medium">{info.getValue()}</Body>
            </div>
          )
        },
      }),
      columnHelper.accessor('code', {
        header: 'Code',
        cell: (info) => <BodySmall className="text-gray-600">{info.getValue()}</BodySmall>,
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => (
          <BodySmall className="text-gray-600 max-w-xs truncate">
            {info.getValue() || '-'}
          </BodySmall>
        ),
      }),
      columnHelper.accessor('_count.users', {
        header: 'Utilisateurs',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <Caption className="text-gray-600">{info.getValue() || 0}</Caption>
          </div>
        ),
      }),
      columnHelper.accessor('_count.permissions', {
        header: 'Permissions',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <Caption className="text-gray-600">{info.getValue() || 0}</Caption>
          </div>
        ),
      }),
      columnHelper.accessor('isActive', {
        header: 'Statut',
        cell: (info) => (
          <Badge variant={info.getValue() ? 'default' : 'secondary'}>
            {info.getValue() ? 'Actif' : 'Inactif'}
          </Badge>
        ),
      }),
      ...(isAdmin
        ? [
            columnHelper.display({
              id: 'actions',
              header: 'Actions',
              cell: (info) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(info.row.original)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(info.row.original)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            }),
          ]
        : []),
    ],
    [isAdmin, onEdit, onDelete]
  )

  const table = useReactTable({
    data: groups,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <BodySmall className="text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
        </BodySmall>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}
