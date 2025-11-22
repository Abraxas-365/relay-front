import { useState } from 'react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Settings, FolderOpen } from 'lucide-react';
import type { TriggerType } from '../../types/workflow';

export const Toolbar = () => {
  const { workflow, createNewWorkflow, openTriggerConfig, updateWorkflowName } =
    useWorkflowStore();
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [selectedTriggerType, setSelectedTriggerType] = useState<TriggerType>('WEBHOOK');

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      createNewWorkflow(newWorkflowName, selectedTriggerType);
      setShowNewWorkflowDialog(false);
      setNewWorkflowName('');
    }
  };

  return (
    <>
      <div className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Relay Workflow Builder
          </h1>

          {workflow && (
            <div className="flex items-center gap-2">
              <Input
                value={workflow.name}
                onChange={(e) => updateWorkflowName(e.target.value)}
                className="w-64"
                placeholder="Workflow name"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={openTriggerConfig}
                title="Configure Trigger"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Load Workflow
          </Button>
          <Button onClick={() => setShowNewWorkflowDialog(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* New Workflow Dialog */}
      {showNewWorkflowDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Create New Workflow</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workflow Name</label>
                <Input
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="My Workflow"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Trigger Type</label>
                <select
                  value={selectedTriggerType}
                  onChange={(e) => setSelectedTriggerType(e.target.value as TriggerType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="WEBHOOK">Webhook</option>
                  <option value="CHANNEL_WEBHOOK">Channel Webhook</option>
                  <option value="SCHEDULE">Schedule</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => setShowNewWorkflowDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow} className="flex-1">
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
