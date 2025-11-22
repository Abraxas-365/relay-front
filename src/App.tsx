import { ReactFlowProvider } from 'reactflow';
import { Toolbar } from './components/workflow/Toolbar';
import { NodePalette } from './components/workflow/NodePalette';
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas';
import { NodeConfigPanel } from './components/workflow/NodeConfigPanel';
import { TriggerConfig } from './components/workflow/TriggerConfig';
import { useWorkflowStore } from './stores/workflowStore';

function App() {
  const { isConfigPanelOpen, isTriggerConfigOpen, workflow } = useWorkflowStore();

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar />

      <div className="flex-1 flex overflow-hidden">
        {workflow && <NodePalette />}

        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>

        {isConfigPanelOpen && <NodeConfigPanel />}
        {isTriggerConfigOpen && <TriggerConfig />}
      </div>
    </div>
  );
}

export default App;
