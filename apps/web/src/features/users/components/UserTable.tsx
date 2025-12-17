import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { User } from '../types/user.types';
import { Badge, Button } from '@repo/ui';
import { BodySmall } from '@repo/ui';
import { ArrowUpDown, MoreHorizontal, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onAssignGroup?: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete, onAssignGroup }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nom complet
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-gray-900">
              {row.original.firstName} {row.original.lastName}
            </div>
            {row.original.displayName && (
              <BodySmall className="text-gray-500">{row.original.displayName}</BodySmall>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <BodySmall className="text-gray-700">{row.original.email}</BodySmall>
        ),
      },
      {
        accessorKey: 'group',
        header: 'Groupe',
        cell: ({ row }) =>
          row.original.group ? (
            <Badge
              variant="secondary"
              style={{
                backgroundColor: row.original.group.color
                  ? `${row.original.group.color}20`
                  : undefined,
                color: row.original.group.color || undefined,
              }}
            >
              {row.original.group.name}
            </Badge>
          ) : (
            <BodySmall className="text-gray-400">Aucun</BodySmall>
          ),
      },
      {
        accessorKey: 'position',
        header: 'Poste',
        cell: ({ row }) => (
          <BodySmall className="text-gray-700">
            {row.original.position || '-'}
          </BodySmall>
        ),
      },
      {
        accessorKey: 'isAdmin',
        header: 'Rôle',
        cell: ({ row }) =>
          row.original.isAdmin ? (
            <Badge variant="destructive" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">Utilisateur</Badge>
          ),
      },
      {
        accessorKey: 'isActive',
        header: 'Statut',
        cell: ({ row }) =>
          row.original.isActive ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Actif
            </Badge>
          ) : (
            <Badge variant="secondary">
              <XCircle className="w-3 h-3 mr-1" />
              Inactif
            </Badge>
          ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(row.original)}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                Modifier
              </Button>
            )}
            {onAssignGroup && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAssignGroup(row.original)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Groupe
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(row.original)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Supprimer
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onEdit, onDelete, onAssignGroup]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <BodySmall className="text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
        </BodySmall>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
