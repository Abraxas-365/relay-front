import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap } from 'lucide-react';

interface TriggerNodeData {
  label: string;
  triggerType: string;
}

interface TriggerNodeProps {
  data: TriggerNodeData;
  selected: boolean;
}

const TriggerNode = ({ data, selected }: TriggerNodeProps) => {
  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white min-w-[150px] ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5" />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide">Trigger</div>
          <div className="text-sm font-medium">{data.triggerType}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-white !border-2 !border-purple-500"
      />
    </div>
  );
};

export default memo(TriggerNode);
