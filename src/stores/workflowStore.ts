import { create } from 'zustand';
import type { Workflow, WorkflowNode, Trigger, NodeType, TriggerType } from '../types/workflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange } from 'reactflow';

interface WorkflowStore {
  // Current workflow being edited
  workflow: Workflow | null;

  // React Flow nodes and edges
  nodes: Node[];
  edges: Edge[];

  // UI state
  selectedNodeId: string | null;
  isConfigPanelOpen: boolean;
  isTriggerConfigOpen: boolean;
  isDirty: boolean;

  // Actions
  createNewWorkflow: (name: string, triggerType: TriggerType) => void;
  loadWorkflow: (workflow: Workflow) => void;
  updateWorkflowName: (name: string) => void;
  updateWorkflowDescription: (description: string) => void;

  // Trigger actions
  updateTrigger: (trigger: Trigger) => void;
  openTriggerConfig: () => void;
  closeTriggerConfig: () => void;

  // Node actions
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, config: any) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;

  // React Flow actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: any) => void;

  // Config panel
  openConfigPanel: () => void;
  closeConfigPanel: () => void;

  // Persistence
  markDirty: () => void;
  markClean: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflow: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isConfigPanelOpen: false,
  isTriggerConfigOpen: false,
  isDirty: false,

  createNewWorkflow: (name: string, triggerType: TriggerType) => {
    const newWorkflow: Workflow = {
      name,
      description: '',
      trigger: {
        type: triggerType,
        config: {},
      },
      nodes: {},
      is_active: false,
    };

    // Create trigger node for visualization
    const triggerNode: Node = {
      id: 'trigger',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        label: triggerType,
        triggerType,
      },
    };

    set({
      workflow: newWorkflow,
      nodes: [triggerNode],
      edges: [],
      selectedNodeId: null,
      isDirty: false,
    });
  },

  loadWorkflow: (workflow: Workflow) => {
    // Convert workflow nodes to React Flow nodes and edges
    const reactFlowNodes: Node[] = [];
    const reactFlowEdges: Edge[] = [];

    // Add trigger node
    reactFlowNodes.push({
      id: 'trigger',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        label: workflow.trigger.type,
        triggerType: workflow.trigger.type,
      },
    });

    // Add workflow nodes
    Object.entries(workflow.nodes).forEach(([nodeId, node]) => {
      reactFlowNodes.push({
        id: nodeId,
        type: 'workflow',
        position: node.position || { x: 250, y: 100 },
        data: {
          label: node.type,
          nodeType: node.type,
          config: node.config,
        },
      });

      // Create edges based on 'next' field
      if (node.next) {
        if (Array.isArray(node.next)) {
          node.next.forEach((targetId) => {
            reactFlowEdges.push({
              id: `${nodeId}-${targetId}`,
              source: nodeId,
              target: targetId,
              type: 'smoothstep',
            });
          });
        } else {
          reactFlowEdges.push({
            id: `${nodeId}-${node.next}`,
            source: nodeId,
            target: node.next,
            type: 'smoothstep',
          });
        }
      }
    });

    set({
      workflow,
      nodes: reactFlowNodes,
      edges: reactFlowEdges,
      isDirty: false,
    });
  },

  updateWorkflowName: (name: string) => {
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: { ...workflow, name },
        isDirty: true,
      });
    }
  },

  updateWorkflowDescription: (description: string) => {
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: { ...workflow, description },
        isDirty: true,
      });
    }
  },

  updateTrigger: (trigger: Trigger) => {
    const { workflow, nodes } = get();
    if (workflow) {
      // Update trigger node
      const updatedNodes = nodes.map((node) =>
        node.id === 'trigger'
          ? { ...node, data: { ...node.data, label: trigger.type, triggerType: trigger.type } }
          : node
      );

      set({
        workflow: { ...workflow, trigger },
        nodes: updatedNodes,
        isDirty: true,
      });
    }
  },

  openTriggerConfig: () => set({ isTriggerConfigOpen: true }),
  closeTriggerConfig: () => set({ isTriggerConfigOpen: false }),

  addNode: (type: NodeType, position: { x: number; y: number }) => {
    const { workflow, nodes } = get();
    if (!workflow) return;

    const nodeId = `node_${Date.now()}`;
    const newWorkflowNode: WorkflowNode = {
      id: nodeId,
      type,
      config: {},
      position,
    };

    const newReactFlowNode: Node = {
      id: nodeId,
      type: 'workflow',
      position,
      data: {
        label: type,
        nodeType: type,
        config: {},
      },
    };

    set({
      workflow: {
        ...workflow,
        nodes: {
          ...workflow.nodes,
          [nodeId]: newWorkflowNode,
        },
      },
      nodes: [...nodes, newReactFlowNode],
      selectedNodeId: nodeId,
      isConfigPanelOpen: true,
      isDirty: true,
    });
  },

  updateNode: (nodeId: string, config: any) => {
    const { workflow, nodes } = get();
    if (!workflow) return;

    const updatedWorkflowNodes = {
      ...workflow.nodes,
      [nodeId]: {
        ...workflow.nodes[nodeId],
        config,
      },
    };

    const updatedReactFlowNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, config } } : node
    );

    set({
      workflow: {
        ...workflow,
        nodes: updatedWorkflowNodes,
      },
      nodes: updatedReactFlowNodes,
      isDirty: true,
    });
  },

  deleteNode: (nodeId: string) => {
    const { workflow, nodes, edges } = get();
    if (!workflow) return;

    const { [nodeId]: deletedNode, ...remainingNodes } = workflow.nodes;

    set({
      workflow: {
        ...workflow,
        nodes: remainingNodes,
      },
      nodes: nodes.filter((node) => node.id !== nodeId),
      edges: edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: null,
      isConfigPanelOpen: false,
      isDirty: true,
    });
  },

  selectNode: (nodeId: string | null) => {
    set({
      selectedNodeId: nodeId,
      isConfigPanelOpen: nodeId !== null && nodeId !== 'trigger',
      isTriggerConfigOpen: nodeId === 'trigger',
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    const { nodes, workflow } = get();
    const updatedNodes = applyNodeChanges(changes, nodes);

    // Update positions in workflow nodes
    if (workflow) {
      const updatedWorkflowNodes = { ...workflow.nodes };
      updatedNodes.forEach((node) => {
        if (node.id !== 'trigger' && updatedWorkflowNodes[node.id]) {
          updatedWorkflowNodes[node.id].position = node.position;
        }
      });

      set({
        nodes: updatedNodes,
        workflow: { ...workflow, nodes: updatedWorkflowNodes },
        isDirty: true,
      });
    } else {
      set({ nodes: updatedNodes });
    }
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const { edges, workflow } = get();
    const updatedEdges = applyEdgeChanges(changes, edges);

    // Update 'next' fields in workflow nodes
    if (workflow) {
      const updatedWorkflowNodes = { ...workflow.nodes };

      // Clear all 'next' fields first
      Object.keys(updatedWorkflowNodes).forEach((nodeId) => {
        delete updatedWorkflowNodes[nodeId].next;
      });

      // Rebuild 'next' from edges
      updatedEdges.forEach((edge) => {
        if (edge.source !== 'trigger' && updatedWorkflowNodes[edge.source]) {
          const currentNext = updatedWorkflowNodes[edge.source].next;
          if (!currentNext) {
            updatedWorkflowNodes[edge.source].next = edge.target;
          } else if (Array.isArray(currentNext)) {
            updatedWorkflowNodes[edge.source].next = [...currentNext, edge.target];
          } else {
            updatedWorkflowNodes[edge.source].next = [currentNext, edge.target];
          }
        }
      });

      set({
        edges: updatedEdges,
        workflow: { ...workflow, nodes: updatedWorkflowNodes },
        isDirty: true,
      });
    } else {
      set({ edges: updatedEdges });
    }
  },

  onConnect: (connection: any) => {
    const { edges, workflow } = get();
    const newEdge: Edge = {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: 'smoothstep',
    };

    const updatedEdges = [...edges, newEdge];

    // Update 'next' field in workflow node
    if (workflow && connection.source !== 'trigger') {
      const updatedWorkflowNodes = { ...workflow.nodes };
      const sourceNode = updatedWorkflowNodes[connection.source];

      if (sourceNode) {
        const currentNext = sourceNode.next;
        if (!currentNext) {
          sourceNode.next = connection.target;
        } else if (Array.isArray(currentNext)) {
          sourceNode.next = [...currentNext, connection.target];
        } else {
          sourceNode.next = [currentNext, connection.target];
        }

        set({
          edges: updatedEdges,
          workflow: { ...workflow, nodes: updatedWorkflowNodes },
          isDirty: true,
        });
      }
    } else {
      set({ edges: updatedEdges });
    }
  },

  openConfigPanel: () => set({ isConfigPanelOpen: true }),
  closeConfigPanel: () => set({ isConfigPanelOpen: false, selectedNodeId: null }),

  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
