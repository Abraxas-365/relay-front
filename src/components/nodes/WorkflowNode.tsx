import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { nodeMetadata } from '../../lib/utils';
import type { NodeType } from '../../types/workflow';
import * as Icons from 'lucide-react';

interface WorkflowNodeData {
  label: string;
  nodeType: NodeType;
  config: any;
}

interface WorkflowNodeProps {
  data: WorkflowNodeData;
  selected: boolean;
}

const WorkflowNode = ({ data, selected }: WorkflowNodeProps) => {
  const metadata = nodeMetadata[data.nodeType];
  const IconComponent = (Icons as any)[metadata.icon] || Icons.Box;

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg bg-card border-2 min-w-[180px] transition-all ${
        selected ? 'border-primary shadow-lg' : 'border-border'
      }`}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: metadata.color,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-primary"
      />

      <div className="flex items-center gap-2">
        <div
          className="p-2 rounded"
          style={{
            backgroundColor: `${metadata.color}20`,
            color: metadata.color,
          }}
        >
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {metadata.category}
          </div>
          <div className="text-sm font-semibold">{metadata.label}</div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-primary"
      />
    </div>
  );
};

export default memo(WorkflowNode);
