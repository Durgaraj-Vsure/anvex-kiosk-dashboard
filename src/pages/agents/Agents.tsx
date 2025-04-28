import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Agent } from '../../types';
import { getAgents, createAgent, updateAgent, deleteAgent } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import AgentForm from './AgentForm';

export default function Agents() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => getAgents({ page: 1, limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent created successfully');
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create agent');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, agent }: { id: string; agent: Partial<Agent> }) => updateAgent(id, agent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent updated successfully');
      setIsFormOpen(false);
      setSelectedAgent(null);
    },
    onError: (error) => {
      toast.error('Failed to update agent');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete agent');
    },
  });

  const columns = [
    {
      accessorKey: 'agent_name',
      header: 'Name',
    },
    {
      accessorKey: 'system_instruction',
      header: 'System Instruction',
      cell: ({ row }: { row: { original: Agent } }) => (
        <div className="max-w-xs truncate">{row.original.system_instruction}</div>
      ),
    },
    {
      accessorKey: 'is_default',
      header: 'Default',
      cell: ({ row }: { row: { original: Agent } }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.is_default
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.original.is_default ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: { row: { original: Agent } }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.original.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }: { row: { original: Agent } }) =>
        format(new Date(row.original.created_at), 'MMM dd, yyyy'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Agent } }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedAgent(row.original);
              setIsFormOpen(true);
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this agent?')) {
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
        title="Agents"
        searchPlaceholder="Search agents..."
        onAdd={() => {
          setSelectedAgent(null);
          setIsFormOpen(true);
        }}
      />

      {isFormOpen && (
        <AgentForm
          agent={selectedAgent}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedAgent(null);
          }}
          onSubmit={(agent) => {
            if (selectedAgent) {
              updateMutation.mutate({ id: selectedAgent._id, agent });
            } else {
              createMutation.mutate(agent);
            }
          }}
        />
      )}
    </div>
  );
} 