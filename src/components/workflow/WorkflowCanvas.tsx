import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../stores/workflowStore';
import TriggerNode from '../nodes/TriggerNode';
import WorkflowNode from '../nodes/WorkflowNode';
import { Save, Play } from 'lucide-react';
import { Button } from '../ui/button';

export const WorkflowCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    isDirty,
    workflow,
    saveWorkflow,
  } = useWorkflowStore();

  // Memoize nodeTypes to prevent React Flow warning
  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      workflow: WorkflowNode,
    }),
    []
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleSave = async () => {
    try {
      await saveWorkflow();
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow. Check console for details.');
    }
  };

  const handleTest = () => {
    // TODO: Implement test functionality
    console.log('Testing workflow:', workflow);
  };

  // Show welcome screen if no workflow
  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Relay Workflow Builder</h2>
          <p className="text-muted-foreground mb-6">
            Create powerful automation workflows with a visual editor. Get started by creating
            your first workflow.
          </p>
          <div className="text-sm text-muted-foreground">
            Click "New Workflow" in the top right to begin
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'trigger') return '#a855f7';
            return '#3b82f6';
          }}
          className="bg-card"
        />

        <Panel position="top-right" className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!isDirty}
            size="sm"
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button
            onClick={handleTest}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Test
          </Button>
        </Panel>

        <Panel position="top-left">
          <div className="bg-card border border-border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold">{workflow.name}</h2>
            {workflow.description && (
              <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
