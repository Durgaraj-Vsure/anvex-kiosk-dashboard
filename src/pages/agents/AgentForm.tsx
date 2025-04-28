import { useState, useEffect } from 'react';
import { Agent } from '../../types';

interface AgentFormProps {
  agent: Agent | null;
  onClose: () => void;
  onSubmit: (agent: Partial<Agent>) => void;
}

export default function AgentForm({ agent, onClose, onSubmit }: AgentFormProps) {
  const [formData, setFormData] = useState<Partial<Agent>>({
    agent_name: '',
    system_instruction: '',
    params: {
      temperature: 0.7,
      topK: 40,
      safetySettings: {
        harassmentThreshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    },
    is_default: false,
    is_active: true,
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        agent_name: agent.agent_name,
        system_instruction: agent.system_instruction,
        params: agent.params,
        is_default: agent.is_default,
        is_active: agent.is_active,
      });
    }
  }, [agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {agent ? 'Edit Agent' : 'Add New Agent'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="agent_name" className="block text-sm font-medium text-gray-700">
                Agent Name
              </label>
              <input
                type="text"
                id="agent_name"
                value={formData.agent_name}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                className="mt-1 input"
                required
              />
            </div>

            <div>
              <label htmlFor="system_instruction" className="block text-sm font-medium text-gray-700">
                System Instruction
              </label>
              <textarea
                id="system_instruction"
                value={formData.system_instruction}
                onChange={(e) => setFormData({ ...formData, system_instruction: e.target.value })}
                className="mt-1 input"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                  Temperature
                </label>
                <input
                  type="number"
                  id="temperature"
                  value={formData.params?.temperature}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      params: { ...formData.params!, temperature: parseFloat(e.target.value) },
                    })
                  }
                  className="mt-1 input"
                  min="0"
                  max="1"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label htmlFor="topK" className="block text-sm font-medium text-gray-700">
                  Top K
                </label>
                <input
                  type="number"
                  id="topK"
                  value={formData.params?.topK}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      params: { ...formData.params!, topK: parseInt(e.target.value) },
                    })
                  }
                  className="mt-1 input"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="harassmentThreshold" className="block text-sm font-medium text-gray-700">
                Harassment Threshold
              </label>
              <select
                id="harassmentThreshold"
                value={formData.params?.safetySettings.harassmentThreshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    params: {
                      ...formData.params!,
                      safetySettings: {
                        ...formData.params!.safetySettings,
                        harassmentThreshold: e.target.value,
                      },
                    },
                  })
                }
                className="mt-1 input"
                required
              >
                <option value="BLOCK_NONE">None</option>
                <option value="BLOCK_LOW_AND_ABOVE">Low and Above</option>
                <option value="BLOCK_MEDIUM_AND_ABOVE">Medium and Above</option>
                <option value="BLOCK_HIGH_AND_ABOVE">High and Above</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Default Agent
                </label>
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
                {agent ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 