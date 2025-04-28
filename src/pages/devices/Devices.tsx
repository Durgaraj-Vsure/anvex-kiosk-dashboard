import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Device } from '../../types';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import DeviceForm from './DeviceForm';

export default function Devices() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: () => getDevices({ page: 1, limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device created successfully');
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create device');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, device }: { id: string; device: Partial<Device> }) => updateDevice(id, device),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device updated successfully');
      setIsFormOpen(false);
      setSelectedDevice(null);
    },
    onError: (error) => {
      toast.error('Failed to update device');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete device');
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
      cell: ({ row }: { row: { original: Device } }) => row.original.agent_id || 'None',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: { row: { original: Device } }) => (
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
      accessorKey: 'last_connected_at',
      header: 'Last Connected',
      cell: ({ row }: { row: { original: Device } }) =>
        row.original.last_connected_at
          ? format(new Date(row.original.last_connected_at), 'MMM dd, yyyy HH:mm')
          : 'Never',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Device } }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedDevice(row.original);
              setIsFormOpen(true);
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this device?')) {
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
        title="Devices"
        searchPlaceholder="Search devices..."
        onAdd={() => {
          setSelectedDevice(null);
          setIsFormOpen(true);
        }}
      />

      {isFormOpen && (
        <DeviceForm
          device={selectedDevice}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedDevice(null);
          }}
          onSubmit={(device) => {
            if (selectedDevice) {
              updateMutation.mutate({ id: selectedDevice._id, device });
            } else {
              createMutation.mutate(device);
            }
          }}
        />
      )}
    </div>
  );
} 