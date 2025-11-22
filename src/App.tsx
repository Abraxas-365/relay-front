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
    <div className="h-screen flex flex-col">
      <Toolbar />

      <div className="flex-1 flex overflow-hidden relative">
        {workflow && <NodePalette />}

        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>

        {isConfigPanelOpen && <NodeConfigPanel />}
        {isTriggerConfigOpen && <TriggerConfig />}

        {!workflow && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-50 pointer-events-none">
            <div className="text-center max-w-md pointer-events-auto">
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
        )}
      </div>
    </div>
  );
}

export default App;
