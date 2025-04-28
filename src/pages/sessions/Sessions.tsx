import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Session } from '../../types';
import { getSessions, deleteSession } from '../../services/api';
import DataTable from '../../components/common/DataTable';

export default function Sessions() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => getSessions({ page: 1, limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete session');
    },
  });

  const columns = [
    {
      accessorKey: 'session_id',
      header: 'Session ID',
    },
    {
      accessorKey: 'device_id',
      header: 'Device ID',
    },
    {
      accessorKey: 'agent_id',
      header: 'Agent ID',
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }: { row: { original: Session } }) =>
        format(new Date(row.original.created_at), 'MMM dd, yyyy HH:mm'),
    },
    {
      accessorKey: 'chat_log',
      header: 'Messages',
      cell: ({ row }: { row: { original: Session } }) => row.original.chat_log.length,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Session } }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // TODO: Implement session details view
              toast.info('Session details view coming soon');
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            View
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this session?')) {
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
        title="Sessions"
        searchPlaceholder="Search sessions..."
      />
    </div>
  );
} 