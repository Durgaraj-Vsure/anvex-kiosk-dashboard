import { useState, useEffect } from 'react';
import { Device } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { getAgents } from '../../services/api';

interface DeviceFormProps {
  device: Device | null;
  onClose: () => void;
  onSubmit: (device: Partial<Device>) => void;
}

export default function DeviceForm({ device, onClose, onSubmit }: DeviceFormProps) {
  const [formData, setFormData] = useState<Partial<Device>>({
    device_id: '',
    agent_id: null,
    is_active: true,
  });

  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: () => getAgents({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (device) {
      setFormData({
        device_id: device.device_id,
        agent_id: device.agent_id,
        is_active: device.is_active,
      });
    }
  }, [device]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {device ? 'Edit Device' : 'Add New Device'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="device_id" className="block text-sm font-medium text-gray-700">
                Device ID
              </label>
              <input
                type="text"
                id="device_id"
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                className="mt-1 input"
                required
              />
            </div>

            <div>
              <label htmlFor="agent_id" className="block text-sm font-medium text-gray-700">
                Agent
              </label>
              <select
                id="agent_id"
                value={formData.agent_id || ''}
                onChange={(e) => setFormData({ ...formData, agent_id: e.target.value || null })}
                className="mt-1 input"
              >
                <option value="">None</option>
                {agentsData?.data.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.agent_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {device ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 