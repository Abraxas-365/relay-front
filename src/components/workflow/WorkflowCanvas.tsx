import { useCallback } from 'react';
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

const nodeTypes = {
  trigger: TriggerNode,
  workflow: WorkflowNode,
};

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
  } = useWorkflowStore();

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving workflow:', workflow);
  };

  const handleTest = () => {
    // TODO: Implement test functionality
    console.log('Testing workflow:', workflow);
  };

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

        {workflow && (
          <Panel position="top-left">
            <div className="bg-card border border-border rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold">{workflow.name}</h2>
              {workflow.description && (
                <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
              )}
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
