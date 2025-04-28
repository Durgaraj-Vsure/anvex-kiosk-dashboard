import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Incident } from '../../types';
import { getIncidents, deleteIncident } from '../../services/api';
import DataTable from '../../components/common/DataTable';

export default function Incidents() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => getIncidents({ page: 1, limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      toast.success('Incident deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete incident');
    },
  });

  const columns = [
    {
      accessorKey: 'device_id',
      header: 'Device ID',
    },
    {
      accessorKey: 'agent_id',
      header: 'Agent ID',
      cell: ({ row }: { row: { original: Incident } }) => row.original.agent_id || 'None',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: Incident } }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.status === 'connected'
              ? 'bg-green-100 text-green-800'
              : row.original.status === 'failed'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }: { row: { original: Incident } }) =>
        format(new Date(row.original.created_at), 'MMM dd, yyyy HH:mm'),
    },
    {
      accessorKey: 'details',
      header: 'Details',
      cell: ({ row }: { row: { original: Incident } }) => {
        const details = row.original.details;
        if (typeof details === 'string') {
          return details;
        }
        return (
          <div className="max-w-xs truncate">
            {details.error} (Code: {details.errorCode})
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Incident } }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // TODO: Implement incident details view
              toast.info('Incident details view coming soon');
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            View
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this incident?')) {
                deleteMutation.mutate(row.original._id);
              }
            }}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DataTable
        data={data?.data || []}
        columns={columns}
        title="Incidents"
        searchPlaceholder="Search incidents..."
      />
    </div>
  );
} 